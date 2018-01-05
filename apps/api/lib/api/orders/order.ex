defmodule Api.Orders.Order do
  use Api, :context
  alias Core.Order

  def pending(%{state: state}, _args, _ctx) do
    {:ok, state == Order.pending}
  end

  def confirmed(%{state: state}, _args, _ctx) do
    {:ok, state == Order.confirmed}
  end

  def finished(%{state: state}, _args, _ctx) do
    {:ok, state == Order.finished}
  end

  def no_motoboy(%{state: state}, _args, _ctx) do
    {:ok, state == Order.no_motoboys}
  end

  def canceled(%{state: state}, _args, _ctx) do
    {:ok, state == Order.canceled}
  end

  def formatted_price(%Order{} = order, _args, _ctx) do
    {:ok, Money.to_string(order.price || %Money{amount: 0})}
  end
end
