defmodule Motoboy.Resolve.ConfirmOrder do
  use Api, :resolver

  alias Core.{Order, History}

  def handle(%{order_id: order_id}, %{context: %{current_motoboy: current_motoboy}}) do
    Repo.transaction(fn ->
      process!(order_id, current_motoboy)
    end)
  end

  defp process!(order_id, motoboy) do
    order = Motoboy.SharedFunctions.get_order!(order_id, motoboy.id)
    make_motoboy_busy!(motoboy)
    add_to_history(order.id, motoboy.id)
    confirm_order!(order)
  end

  defp confirm_order!(order) do
    order
    |> Order.changeset(%{state: Order.confirmed(), confirmed_at: Timex.local()})
    |> Repo.update!()
  end

  defp make_motoboy_busy!(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{state: Core.Motoboy.busy(), became_busy_at: Timex.local()})
    |> Repo.update!()
  end

  defp add_to_history(order_id, motoboy_id) do
    Repo.insert(%History{
      scope: "motoboy",
      text: "Confirmou pedido",
      order_id: order_id,
      motoboy_id: motoboy_id
    })

    Repo.insert(%History{
      scope: "order",
      text: "Pedido confirmado",
      order_id: order_id,
      motoboy_id: motoboy_id
    })
  end
end
