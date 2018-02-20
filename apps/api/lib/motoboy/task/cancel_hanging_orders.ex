defmodule Motoboy.Task.CancelHangingOrders do
  @moduledoc """
  This task checks for orders, created by customers only (not centrals),
  that have been waiting for confirmation of a motoboy.

  If the time passes, we mark the order as if the motoboy
  has "Refused" it.

  Delete previously sent notification.
  Send a new notification to the motoboy informing what happened.
  """

  use Api, :resolver
  alias Core.{Order, History}

  @doc """
  Wait 2 minutes before Refusing
  """
  @minutes_to_wait 2 # minutes

  def handle do
    orders_pending()
    |> refuse_them_all
  end

  defp orders_pending do
    two_minutes_ago = Timex.shift(Timex.local, minutes: -@minutes_to_wait)

    from(
      o in Order,
      where: o.sent_at <= ^two_minutes_ago,
      where: o.state == ^Order.pending()
    )
    |> Repo.all()
  end

  defp refuse_them_all(orders) do
    orders
    |> Enum.each(&refuse_order/1)
  end

  defp refuse_order(order) do
    order
    |> refuse
    |> case do
      {:ok, motoboy} ->
        motoboy |> notify_auto_refuse

      {:error, _} ->
        nil
    end
  end

  @spec refuse(%Order{}) :: %Core.Motoboy{}
  defp refuse(order) do
    Repo.transaction(fn ->
      motoboy =
        order
        |> get_motoboy!
        |> track_auto_refuse(order)

      order
      |> track_auto_cancel(motoboy)
      |> Motoboy.Resolve.CancelOrder.auto_refuse(motoboy)
      |> case do
        {:ok, motoboy} ->
          motoboy

        {:error, changeset} ->
          Api.ErrorHelper.messages(changeset)
          |> Repo.rollback()
      end
    end)
  end

  defp get_motoboy!(%Order{motoboy_id: id}) do
    Repo.get!(Core.Motoboy, id)
  end

  defp notify_auto_refuse(%Core.Motoboy{} = motoboy) do
    motoboy
    |> Central.Shared.NotifyMotoboy.order_auto_canceled()
  end

  defp track_auto_refuse(%Core.Motoboy{} = motoboy, %Order{} = order) do
    Repo.insert(%History{
      scope: "motoboy",
      text: "Não confirmou o pedido a tempo",
      order_id: order.id,
      motoboy_id: motoboy.id
    })

    motoboy
  end

  defp track_auto_cancel(%Order{} = order, %Core.Motoboy{} = motoboy) do
    Repo.insert(%History{
      scope: "order",
      text: "Cancelamento automático",
      order_id: order.id,
      motoboy_id: motoboy.id
    })

    order
  end
end
