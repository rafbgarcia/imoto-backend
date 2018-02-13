defmodule Company.Resolve.CreateOrder do
  use Api, :resolver
  alias Core.{Motoboy, Order, History}

  def handle(%{order_params: order_params}, %{context: %{current_company: company}}) do
    with {:ok, my_centrals_ids} <- get_centrals_ids(company.id),
         {:ok, motoboy} <- next_motoboy_or_error(my_centrals_ids),
         {:ok, order} <- create_order(company, motoboy, order_params) do
      Central.Shared.NotifyMotoboy.new_order(motoboy.one_signal_player_id)
      add_to_history(order.id, motoboy.id)

      {:ok, order}
    end
  end

  def handle(_, _) do
    {:error, "Algo deu errado, por favor refaça login e tente novamente"}
  end

  defp get_centrals_ids(company_id) do
    from(
      cc in "companies_centrals",
      where: cc.company_id == ^company_id,
      select: cc.central_id
    )
    |> Repo.all()
    |> Enum.map(& &1["central_id"])
  end

  defp create_order(company, motoboy, order_params) do
    order_params =
      Map.merge(order_params, %{
        company_id: company.id,
        motoboy_id: motoboy.id,
        state: Order.pending()
      })

    Order.changeset(%Order{}, order_params)
    |> Repo.insert()
  end

  defp next_motoboy_or_error(centrals_ids) do
    Repo.transaction(fn ->
      case next_available_motoboy(centrals_ids) do
        nil -> nil
        motoboy -> update_motoboy_state(motoboy)
      end
    end)
  end

  defp next_available_motoboy(centrals_ids) do
    from(
      m in Motoboy,
      lock: "FOR UPDATE",
      where: m.active == ^true,
      where: m.state == ^Motoboy.available(),
      where: m.central_id in ^centrals_ids,
      order_by: m.became_available_at
    )
    |> first
    |> Repo.one()
  end

  defp update_motoboy_state(motoboy) do
    motoboy
    |> Motoboy.changeset(%{state: Motoboy.busy(), became_busy_at: Timex.local()})
    |> Repo.update!()
  end

  defp add_to_history(order_id, motoboy_id) do
    Repo.insert(%History{
      scope: "motoboy",
      text: "Recebeu pedido",
      order_id: order_id,
      motoboy_id: motoboy_id
    })

    Repo.insert(%History{
      scope: "order",
      text: "Pedido enviado",
      order_id: order_id,
      motoboy_id: motoboy_id
    })
  end
end
