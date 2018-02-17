defmodule Motoboy.Resolve.FinishOrder do
  use Api, :resolver

  alias Core.{Order, History}

  def handle(%{order_id: order_id}, %{context: %{current_motoboy: motoboy}}) do
    Repo.transaction(fn ->
      order =
        Motoboy.SharedFunctions.get_order!(order_id, motoboy.id)
        |> finish!
        |> track_finished_by(motoboy)

      motoboy
      |> track_finish(order)
      |> Motoboy.SharedFunctions.ongoing_orders()
      |> case do
        [] ->
          motoboy |> make_available!
          order

        orders ->
          orders
      end
    end)
  end

  defp finish!(%Order{} = order) do
    order
    |> Order.changeset(%{state: Order.finished()})
    |> Order.changeset(%{finished_at: Timex.local()})
    |> Repo.update!()
  end

  defp track_finished_by(%Order{} = order, %Core.Motoboy{} = motoboy) do
    Repo.insert(%History{
      scope: "order",
      text: "Pedido finalizado",
      order_id: order.id,
      motoboy_id: motoboy.id
    })

    order
  end

  defp track_finish(%Core.Motoboy{} = motoboy, %Order{} = order) do
    Repo.insert(%History{
      scope: "motoboy",
      text: "Finalizou pedido",
      order_id: order.id,
      motoboy_id: motoboy.id
    })

    motoboy
  end

  defp make_available!(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{
      state: Core.Motoboy.available(),
      became_available_at: Timex.local()
    })
    |> Repo.update!()
  end
end
