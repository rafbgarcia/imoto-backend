defmodule Api.Orders.Order do
  use Api, :context

  def all(_args, _ctx) do
    {:ok, Core.Order |> Repo.all }
  end

  def confirm(%{order_id: order_id} = args, _ctx) do
    case confirm(order_id) do
      {:ok, order} -> {:ok, order}
      {:error, error} -> {:ok, %{error: "Nenhum motoboy disponível"}}
    end
  end
  defp confirm(order_id) do
    Repo.transaction(fn ->
      motoboy = Api.Orders.Motoboy.next_in_queue
      order = confirm!(order_id, motoboy)
      Api.Orders.Motoboy.mark_busy!(motoboy)
      order
    end)
  end
  defp confirm!(order_id, motoboy) do
    now = Timex.local

    Repo.get(Core.Order, order_id)
    |> Core.Order.changeset(%{state: "confirmed", motoboy_id: motoboy.id, confirmed_at: now})
    |> Repo.update!
  end

  def ordered_at(%Core.Order{} = order, _args, _ctx) do
    {:ok, Timex.lformat!(order.inserted_at, "{relative}", "pt_BR", :relative) }
  end

  def pending(%Core.Order{} = order, _args, _ctx) do
    {:ok, order.state == "pending" }
  end

  def confirmed(%Core.Order{} = order, _args, _ctx) do
    {:ok, order.state == "confirmed" }
  end

  def formatted_price(%Core.Order{} = order, _args, _ctx) do
    {:ok, Money.to_string(order.price)}
  end
end
