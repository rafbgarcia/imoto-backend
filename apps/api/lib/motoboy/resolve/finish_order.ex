defmodule Motoboy.Resolve.FinishOrder do
  use Api, :resolver

  alias Core.{Order, History}

  def handle(%{order_id: order_id}, %{context: %{current_motoboy: motoboy}}) do
    Repo.transaction(fn ->
      order = finish_order!(order_id, motoboy)

      case Motoboy.SharedFunctions.has_ongoing_orders(motoboy) do
        true ->
          order

        false ->
          make_motoboy_available!(motoboy)
          order
      end
    end)
  end

  defp finish_order!(order_id, motoboy) do
    order = Motoboy.SharedFunctions.get_order!(order_id, motoboy.id)
    add_to_history(order.id, motoboy.id)
    finish_order!(order)
  end

  defp finish_order!(order) do
    order
    |> Order.changeset(%{state: Order.finished(), finished_at: Timex.local()})
    |> Repo.update!()
  end

  defp add_to_history(order_id, motoboy_id) do
    Repo.insert(%History{
      scope: "order",
      text: "Pedido finalizado",
      order_id: order_id,
      motoboy_id: motoboy_id
    })

    Repo.insert(%History{
      scope: "motoboy",
      text: "Finalizou pedido",
      order_id: order_id,
      motoboy_id: motoboy_id
    })
  end

  defp make_motoboy_available!(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{
      state: Core.Motoboy.available(),
      became_available_at: Timex.local()
    })
    |> Repo.update!()
  end
end
