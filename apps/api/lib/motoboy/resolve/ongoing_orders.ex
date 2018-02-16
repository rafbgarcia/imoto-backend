defmodule Motoboy.Resolve.OngoingOrders do
  use Api, :resolver

  alias Core.{Order}

  def handle(_, %{context: %{current_motoboy: motoboy}}) do
    {:ok, ongoing_orders(motoboy.id)}
  end

  defp ongoing_orders(motoboy_id) do
    from(
      o in Order,
      where: o.motoboy_id == ^motoboy_id,
      where: o.state in [^Order.pending(), ^Order.confirmed()],
      order_by: o.inserted_at
    )
    |> Repo.all
  end
end
