defmodule Order.Resolve.Fields do
  use Api, :resolver
  alias Core.{Order}

  def pending(%{state: state}, _args, _ctx) do
    {:ok, state == Order.pending()}
  end

  def confirmed(%{state: state}, _args, _ctx) do
    {:ok, state == Order.confirmed()}
  end

  def finished(%{state: state}, _args, _ctx) do
    {:ok, state == Order.finished()}
  end

  def in_queue(%{state: state}, _args, _ctx) do
    {:ok, state == Order.in_queue()}
  end

  def canceled(%{state: state}, _args, _ctx) do
    {:ok, state == Order.canceled()}
  end

  def formatted_price(%{price: price}, _args, _ctx) do
    {:ok, Money.to_string(price || %Money{amount: 0})}
  end
end
