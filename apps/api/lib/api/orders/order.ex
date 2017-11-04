defmodule Api.Orders.Order do
  use Api, :context

  def all(_args, _ctx) do
    {:ok, Core.Order |> Repo.all }
  end

  def ordered_at(order, _args, _ctx) do
    {:ok, Timex.lformat!(order.inserted_at, "{relative}", "pt_BR", :relative) }
  end

  def pending(order, _args, _ctx) do
    {:ok, order.state == "pending" }
  end

  def confirmed(order, _args, _ctx) do
    {:ok, order.state == "confirmed" }
  end
end
