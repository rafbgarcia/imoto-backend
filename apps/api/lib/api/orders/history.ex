defmodule Api.Orders.History do
  use Api, :context

  def did_confirm_order(order) do
    Repo.insert(%Core.History{event: "confirmed", text: "Pedido confirmado", order_id: order.id})
  end

  def motoboy_busy(motoboy) do
    Repo.insert(%Core.History{event: "busy", text: "Motoboy selecionado para fazer uma entrega", motoboy_id: motoboy.id})
  end

  def did_cancel_order(order) do
    Repo.insert(%Core.History{event: "canceled", text: "Pedido cancelado", order_id: order.id})
  end
end
