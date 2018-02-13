defmodule Order.Resolve.Fields do
  use Api, :resolver
  alias Core.{Order, Stop}

  def pending(%{state: state}, _args, _ctx) do
    {:ok, state == Order.pending()}
  end

  def confirmed(%{state: state}, _args, _ctx) do
    {:ok, state == Order.confirmed()}
  end

  def finished(%{state: state}, _args, _ctx) do
    {:ok, state == Order.finished()}
  end

  def no_motoboy(%{state: state}, _args, _ctx) do
    {:ok, state == Order.no_motoboys()}
  end

  def canceled(%{state: state}, _args, _ctx) do
    {:ok, state == Order.canceled()}
  end

  def formatted_price(%{price: price}, _args, _ctx) do
    {:ok, Money.to_string(price || %Money{amount: 0})}
  end

  def stops(order, _, _) do
    {:ok, Repo.preload(order, stops: from(s in Stop, order_by: s.sequence)).stops}
  end
end
