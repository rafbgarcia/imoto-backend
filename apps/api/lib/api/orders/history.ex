defmodule Api.Orders.History do
  use Api, :context
  alias Core.History

  def all_of_motoboy(%{motoboy_id: motoboy_id}, _) do
    from(h in History,
      where: h.motoboy_id == ^motoboy_id,
      where: h.scope in ["motoboy", "motoboy_order"],
      where: h.inserted_at >= ^Timex.beginning_of_day(Timex.local),
      where: h.inserted_at <= ^Timex.end_of_day(Timex.local),
      order_by: [asc: :inserted_at],
    )
    |> Repo.all
    |> case do
      results -> {:ok, results}
    end
  end

  @doc """
  A ordem disso é:
  Pedido é feito
    :confirmado -> :finalizado
    :cancelado <-> :novo_motoboy -> :confirmado -> :finalizado
  """

  def new_order(order_id, motoboy_id) do
    Repo.insert(%Core.History{scope: "motoboy_order", text: "Recebeu pedido", order_id: order_id, motoboy_id: motoboy_id})
    Repo.insert(%Core.History{scope: "order", text: "Pedido enviado", order_id: order_id, motoboy_id: motoboy_id})
  end

  def order_confirmed(order_id, motoboy_id) do
    Repo.insert(%Core.History{scope: "motoboy_order", text: "Confirmou pedido", order_id: order_id, motoboy_id: motoboy_id})
    Repo.insert(%Core.History{scope: "order", text: "Pedido confirmado", order_id: order_id, motoboy_id: motoboy_id})
  end

  def order_canceled(order_id, motoboy_id) do
    Repo.insert(%Core.History{scope: "motoboy_order", text: "Cancelou pedido", order_id: order_id, motoboy_id: motoboy_id})
    Repo.insert(%Core.History{scope: "order", text: "Pedido cancelado", order_id: order_id, motoboy_id: motoboy_id})
  end

  def order_new_motoboy(order_id, motoboy_id) do
    Repo.insert(%Core.History{scope: "order", text: "Pedido enviado a outro motoboy", order_id: order_id, motoboy_id: motoboy_id})
    Repo.insert(%Core.History{scope: "motoboy_order", text: "Recebeu pedido", order_id: order_id, motoboy_id: motoboy_id})
  end

  def order_finished(order_id, motoboy_id) do
    Repo.insert(%Core.History{scope: "order", text: "Pedido finalizado", order_id: order_id, motoboy_id: motoboy_id})
    Repo.insert(%Core.History{scope: "motoboy_order", text: "Finalizou pedido", order_id: order_id, motoboy_id: motoboy_id})
  end

  def motoboy_available(motoboy_id) do
    Repo.insert(%Core.History{scope: "motoboy", text: "Ficou online", motoboy_id: motoboy_id})
  end

  def motoboy_unavailable(motoboy_id) do
    Repo.insert(%Core.History{scope: "motoboy", text: "Ficou offline", motoboy_id: motoboy_id})
  end
end
