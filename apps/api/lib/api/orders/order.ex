defmodule Api.Orders.Order do
  use Api, :context

  def all(_args, _ctx) do
    {:ok, Core.Order |> Repo.all }
  end

  def confirm(%{order_id: order_id} = args, _ctx) do
    with {:ok, motoboy} <- Api.Orders.Motoboy.next_in_queue,
      {:ok, order} <- confirm!(order_id, motoboy),
      _ <- Api.Orders.Motoboy.mark_busy(motoboy)
    do
      {:ok, order}
    else
      {:error, error} -> {:ok, %{error: error}}
      nil -> {:ok, %{error: "Nenhum motoboy disponível"}}
    end
  end
  defp confirm!(order_id, motoboy) do
    Repo.get(Core.Order, order_id)
    |> Core.Order.changeset(%{state: "confirmed", motoboy_id: motoboy.id, confirmed_at: Timex.local})
    |> Repo.update
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
