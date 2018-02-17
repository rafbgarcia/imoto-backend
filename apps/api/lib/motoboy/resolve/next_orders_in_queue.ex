defmodule Motoboy.Resolve.NextOrdersInQueue do
  @doc """
  @returns Array<%Core.Order{}> Ongoing orders || Next order in queue || Empty array
  """

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
          {:ok, nil} -> []
          {:ok, order} -> [order]
        end

      _ ->
        []
    end
  end

  defp assign_next_order_in_queue_to(motoboy) do
    case next_order_in_queue(motoboy) do
      nil -> {:ok, nil}
      order -> {:ok, assign_to_motoboy!(order, motoboy)}
    end
  end

  defp assign_to_motoboy!(order, motoboy) do
    order =
      order
      |> update_with_new_motoboy!(motoboy)
      |> track_sent_to_motoboy(motoboy)

    motoboy
    |> make_busy!
    |> track_new_order(order)
    |> Central.Shared.NotifyMotoboy.new_order()

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

  defp update_with_new_motoboy!(%Order{} = order, %Core.Motoboy{id: motoboy_id}) do
    order
    |> Order.changeset(%{state: Order.pending()})
    |> Order.changeset(%{motoboy_id: motoboy_id})
    |> Order.changeset(%{sent_at: Timex.local()})
    |> Repo.update!()
  end

  defp make_busy!(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{state: Core.Motoboy.busy(), became_busy_at: Timex.local()})
    |> Repo.update!()
  end

  defp track_sent_to_motoboy(%Order{} = order, %Core.Motoboy{id: motoboy_id}) do
    Repo.insert(%History{
      scope: "motoboy",
      text: "Recebeu uma entrega",
      order_id: order.id,
      motoboy_id: motoboy_id
    })

    order
  end

  def track_new_order(%Core.Motoboy{} = motoboy, %Order{id: order_id}) do
    Repo.insert(%History{
      scope: "order",
      text: "Pedido enviado para o motoboy",
      order_id: order_id,
      motoboy_id: motoboy.id
    })

    motoboy
  end
end
