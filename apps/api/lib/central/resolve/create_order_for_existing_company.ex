defmodule Central.Resolve.CreateOrderForExistingCompany do
  use Api, :resolver
  alias Core.{Company, Motoboy, Order, History, Location}

  def handle(%{company_id: company_id}, %{context: %{current_central: central}}) do
    with {:ok, company} <- find_my_company!(company_id, central.id),
    {:ok, motoboy} <- next_available_motoboy(central.id),
    {:ok, order} <- create_order(company.id, motoboy.id) do
      notify_motoboy_new_order(motoboy.one_signal_player_id)
      add_to_history(order.id, motoboy.id)

      {:ok, order}
    end
  end
  def handle(_, _) do
    {:error, "Algo deu errado, por favor refaça login e tente novamente"}
  end

  defp find_my_company!(company_id, central_id) do
    from(c in Company,
      where: c.id == ^company_id,
      where: c.central_id == ^central_id
    )
    |> Repo.one
    |> case do
      nil -> {:error, "Empresa não encontrada"}
      company -> {:ok, company}
    end
  end

  defp create_order(company_id, motoboy_id) do
    order_params = %{
      stops: [%{
        sequence: 0,
        instructions: "Falar com o responsável",
        location_id: get_company_location_id(company_id)
      }],
      company_id: company_id,
      motoboy_id: motoboy_id,
      state: Order.pending(),
    }

    Order.changeset(%Order{}, order_params)
    |> Repo.insert
  end

  @doc """
  Returns the ID of the location
  """
  defp get_company_location_id(company_id) do
    from(l in Location,
      where: l.company_id == ^company_id,
      select: l.id,
    )
    |> first
    |> Repo.one
  end

  defp next_available_motoboy(central_id) do
    Repo.transaction(fn ->
      case get_next_motoboy(central_id) do
        nil -> Repo.rollback("Nenhum motoboy disponível")
        motoboy -> update_motoboy_state(motoboy)
      end
    end)
  end

  defp get_next_motoboy(central_id) do
    from(m in Motoboy,
      lock: "FOR UPDATE",
      where: m.state == ^Motoboy.available(),
      where: m.central_id == ^central_id,
      where: m.active == ^true,
      order_by: [asc: m.became_available_at]
    )
    |> first
    |> Repo.one
  end

  defp update_motoboy_state(motoboy) do
    motoboy
    |> Motoboy.changeset(%{state: Motoboy.busy, became_busy_at: Timex.local})
    |> Repo.update!
  end

  defp add_to_history(order_id, motoboy_id) do
    Repo.insert(%History{scope: "motoboy", text: "Recebeu pedido", order_id: order_id, motoboy_id: motoboy_id})
    Repo.insert(%History{scope: "order", text: "Pedido enviado", order_id: order_id, motoboy_id: motoboy_id})
  end

  defp notify_motoboy_new_order(player_id) do
    Api.OneSignal.notify(player_id, "Você tem uma nova entrega!")
  end
end
