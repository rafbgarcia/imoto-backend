defmodule Api.Orders.History do
  use Api, :context

  @doc """
  A order disso é:
  Pedido é feito
    :confirmado -> :finalizado
    :cancelado <-> :novo_motoboy -> :confirmado -> :finalizado
  """

  def new_order(order_id, motoboy_id) do
    Repo.insert(%Core.History{event: "novo_pedido", text: "Pedido enviado", order_id: order_id, motoboy_id: motoboy_id})
  end

  def order_confirmed(order_id, motoboy_id) do
    Repo.insert(%Core.History{event: "pedido_confirmado", text: "Pedido confirmado", order_id: order_id, motoboy_id: motoboy_id})
  end

  def order_canceled(order_id, motoboy_id) do
    Repo.insert(%Core.History{event: "pedido_cancelado", text: "Pedido cancelado", order_id: order_id, motoboy_id: motoboy_id})
  end

  def order_new_motoboy(order_id, motoboy_id) do
    Repo.insert(%Core.History{event: "pedido_novo_motoboy", text: "Pedido enviado a outro motoboy", order_id: order_id, motoboy_id: motoboy_id})
  end

  def order_finished(order_id, motoboy_id) do
    Repo.insert(%Core.History{event: "pedido_finalizado", text: "Pedido finalizado", order_id: order_id, motoboy_id: motoboy_id})
  end

  def motoboy_available(motoboy_id) do
    Repo.insert(%Core.History{event: "motoboy_online", text: "O motoboy ficou online", motoboy_id: motoboy_id})
  end

  def motoboy_unavailable(motoboy_id) do
    Repo.insert(%Core.History{event: "motoboy_offline", text: "O motoboy ficou offline", motoboy_id: motoboy_id})
  end
end
