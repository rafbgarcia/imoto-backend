defmodule Central.Resolve.CreateOrder do
  use Api, :resolver
  alias Core.{CentralCustomer, Motoboy, Order, History}

  def handle(%{params: params, motoboy_id: motoboy_id}, %{context: %{current_central: central}}) do
    with {:ok, _} <- ensure_my_customer!(params.central_customer_id, central.id),
         {:ok, motoboy} <- get_motoboy_for_order(motoboy_id, central.id),
         params <- Map.merge(params, %{motoboy_id: motoboy.id, central_id: central.id}),
         {:ok, order} <- create_order(params) do
      notify_motoboy_new_order(motoboy.one_signal_player_id)
      add_to_history(order.id, motoboy.id)

      {:ok, order}
    end
  end
  def handle(_, _) do
    {:error, "Algo deu errado, por favor refaça login e tente novamente"}
  end

  defp get_motoboy_for_order(motoboy_id, central_id) when motoboy_id == "next_in_queue" do
    next_available_motoboy(central_id)
  end
  defp get_motoboy_for_order(motoboy_id, central_id) do
    motoboy = Repo.get_by(Motoboy, id: motoboy_id, central_id: central_id)

    busy = Motoboy.busy()
    unavailable = Motoboy.unavailable()

    case motoboy do
      nil ->
        {:error, "Este motoboy não foi encontrado"}
      %{state: state} when state == busy ->
        {:error, "Este motoboy está ocupado"}
      %{state: state} when state == unavailable ->
        {:error, "Este motoboy está offline"}
      %{active: active} when active == false ->
        {:error, "Este motoboy está INATIVO. Ative-o para enviar um pedido"}
      motoboy ->
        make_motoboy_busy(motoboy)
    end
  end

  defp ensure_my_customer!(customer_id, central_id) do
    from(
      c in CentralCustomer,
      where: c.id == ^customer_id,
      where: c.central_id == ^central_id
    )
    |> Repo.one()
    |> case do
      customer when is_nil(customer) -> {:error, "Cliente não encontrado"}
      customer -> {:ok, customer}
    end
  end

  defp create_order(params) do
    order_params = Map.merge(params, %{state: Order.pending()})

    %Order{}
    |> Order.changeset(order_params)
    |> Repo.insert()
  end

  defp next_available_motoboy(central_id) do
    Repo.transaction(fn ->
      case get_next_motoboy(central_id) do
        nil -> Repo.rollback("Nenhum motoboy disponível")
        motoboy ->
          make_motoboy_busy(motoboy)
          motoboy
      end
    end)
  end

  defp get_next_motoboy(central_id) do
    from(
      m in Motoboy,
      lock: "FOR UPDATE",
      where: m.state == ^Motoboy.available(),
      where: m.central_id == ^central_id,
      where: m.active == ^true,
      order_by: [asc: m.became_available_at]
    )
    |> first
    |> Repo.one()
  end

  defp make_motoboy_busy(motoboy) do
    motoboy
    |> Motoboy.changeset(%{state: Motoboy.busy(), became_busy_at: Timex.local()})
    |> Repo.update()
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

  defp notify_motoboy_new_order(player_id) do
    Api.OneSignal.notify(player_id, "Você tem uma nova entrega!")
  end
end
