defmodule Motoboy.Resolve.OngoingOrders do
  use Api, :resolver

  def handle(_, %{context: %{current_motoboy: motoboy}}) do
    {:ok, Motoboy.SharedFunctions.ongoing_orders(motoboy)}
  end
end
