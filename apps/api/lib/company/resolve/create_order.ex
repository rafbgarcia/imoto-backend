defmodule Company.Resolve.CreateOrder do
  use Api, :context
  alias Core.{Central, Motoboy, Order, History}

  def handle(%{order_params: order_params}, %{context: %{current_company: company}}) do
    with {:ok, motoboy} <- next_motoboy_or_error(company.id),
    {:ok, order} <- create_order(company, motoboy, order_params) do
      add_to_history(order.id, motoboy.id)
      # spawn fn -> after_create(order) end
      {:ok, order}
    end
  end
  def handle(_, _) do
    {:error, "Algo deu errado, por favor refaça login e tente novamente"}
  end

  defp create_order(company, motoboy, order_params) do
    order_params = Map.merge(order_params, %{
      company_id: company.id,
      motoboy_id: motoboy.id,
      state: "pending",
      price: 1232, # TODO: fix this
    })

    Order.changeset(%Order{}, order_params)
    |> Repo.insert
  end

  defp next_motoboy_or_error(company_id) do
    Repo.transaction(fn ->
      case get_next_motoboy(company_id) do
        nil ->
          Repo.rollback("Ops, nenhum motoboy disponível no momento")
        motoboy ->
          update_central_state(motoboy.central)
          update_motoboy_state(motoboy)
          motoboy
      end
    end)
  end

  defp get_next_motoboy(company_id) do
    from(m in Motoboy,
      lock: "FOR UPDATE",
      join: c in assoc(m, :central),
      join: com in assoc(c, :companies),
      preload: [central: c],
      where: m.state == ^Motoboy.available,
      where: com.id == ^company_id,
      order_by: [asc: m.became_available_at, asc: c.last_order_taken_at]
    )
    |> first
    |> Repo.one
  end

  defp update_motoboy_state(motoboy) do
    motoboy
    |> Motoboy.changeset(%{state: Motoboy.busy, became_busy_at: Timex.local})
    |> Repo.update!
  end

  defp update_central_state(central) do
    central
    |> Central.changeset(%{last_order_taken_at: Timex.local})
    |> Repo.update!
  end

  defp add_to_history(order_id, motoboy_id) do
    Repo.insert(%History{scope: "motoboy_order", text: "Recebeu pedido", order_id: order_id, motoboy_id: motoboy_id})
    Repo.insert(%History{scope: "order", text: "Pedido enviado", order_id: order_id, motoboy_id: motoboy_id})
  end
end
