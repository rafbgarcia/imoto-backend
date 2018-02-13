defmodule Motoboy.Resolve.CurrentOrder do
  use Api, :resolver

  alias Core.{Order, Motoboy, History}

  def handle(_, %{context: %{current_motoboy: motoboy}}) do
    case current_order(motoboy.id) do
      nil ->
        Repo.transaction(fn ->
          next_order_in_queue!(motoboy)
        end)

      order ->
        {:ok, order}
    end
  end

  defp current_order(motoboy_id) do
    from(
      o in Order,
      where: o.motoboy_id == ^motoboy_id,
      where: o.state in [^Order.pending(), ^Order.confirmed()]
    )
    |> first
    |> Repo.one()
  end

  defp next_order_in_queue!(motoboy) do
    case get_next_order_in_queue(motoboy) do
      nil ->
        nil

      order ->
        Central.Shared.NotifyMotoboy.new_order(motoboy.one_signal_player_id)
        make_motoboy_busy!(motoboy)
        update_order_with_new_motoboy!(order, motoboy.id)
    end
  end

  defp get_next_order_in_queue(%Motoboy{id: id, central_id: central_id, state: state}) do
    available = Motoboy.available()

    with ^available <- state do
      from(
        o in Order,
        lock: "FOR UPDATE",
        where: o.central_id == ^central_id,
        where: o.motoboy_id == ^id or is_nil(o.motoboy_id),
        where: o.state in [^Order.in_queue()],
        order_by: o.queued_at
      )
      |> first
      |> Repo.one()
    else
      _ -> nil
    end
  end

  defp update_order_with_new_motoboy!(order, motoboy_id) do
    order
    |> Order.changeset(%{
      state: Order.pending(),
      motoboy_id: motoboy_id,
      sent_at: Timex.local
    })
    |> Repo.update!()
  end

  defp make_motoboy_busy!(motoboy) do
    motoboy
    |> Motoboy.changeset(%{state: Motoboy.busy(), became_busy_at: Timex.local()})
    |> Repo.update!()
  end

  defp add_order_pending_to_history(order_id, motoboy_id) do
    Repo.insert(%History{
      scope: "motoboy",
      text: "Recebeu uma entrega",
      order_id: order_id,
      motoboy_id: motoboy_id
    })

    Repo.insert(%History{
      scope: "order",
      text: "Pedido enviado para o motoboy",
      order_id: order_id,
      motoboy_id: motoboy_id
    })
  end

end
