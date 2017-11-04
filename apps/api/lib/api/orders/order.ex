defmodule Api.Orders.Order do
  use Api, :context

  def all(_args, _ctx) do
    {:ok, Core.Order |> Repo.all }
  end

  def ordered_at(order, _args, _ctx) do
    {:ok, order.inserted_at }
  end

  def pending(order, _args, _ctx) do
    {:ok, order.state == "pending" }
  end

  def confirmed(order, _args, _ctx) do
    {:ok, order.state == "confirmed" }
  end
end
