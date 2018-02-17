defmodule Motoboy.Resolve.NextOrdersInQueue do
  use Api, :resolver

  alias Core.{Order, History}

  def handle(_, %{context: %{current_motoboy: motoboy}}) do
    motoboy
    |> Motoboy.SharedFunctions.ongoing_orders()
    |> case do
      [] ->
        Repo.transaction(fn -> get_my_next_order(motoboy) end)

      orders ->
        {:ok, orders}
    end
  end

  def get_my_next_order(motoboy) do
    available = Core.Motoboy.available()

    case motoboy.state do
      ^available ->
        case assign_next_order_in_queue_to(motoboy) do
          {:error, message} -> Repo.rollback(message)
          {:ok, order} -> order
        end

      _ ->
        nil
    end
  end

  defp assign_next_order_in_queue_to(motoboy) do
    case next_order_in_queue(motoboy) do
      nil -> {:ok, nil}
      order -> {:ok, assign_to_motoboy!(order, motoboy)}
    end
  end

  defp assign_to_motoboy!(order, motoboy) do
    make_motoboy_busy!(motoboy)
    order = update_order_with_new_motoboy!(order, motoboy.id)
    Central.Shared.NotifyMotoboy.new_order(motoboy.one_signal_player_id)
    add_order_pending_to_history(order.id, motoboy.id)
    order
  end

  defp next_order_in_queue(%Core.Motoboy{central_id: central_id}) do
    from(
      o in Order,
      lock: "FOR UPDATE",
      where: o.central_id == ^central_id,
      where: o.state in [^Order.in_queue()],
      order_by: o.queued_at
    )
    |> first
    |> Repo.one()
  end

  defp update_order_with_new_motoboy!(order, motoboy_id) do
    order
    |> Order.changeset(%{
      state: Order.pending(),
      motoboy_id: motoboy_id,
      sent_at: Timex.local()
    })
    |> Repo.update!()
  end

  defp make_motoboy_busy!(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{state: Core.Motoboy.busy(), became_busy_at: Timex.local()})
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
