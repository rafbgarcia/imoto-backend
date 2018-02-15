defmodule Central.Resolve.MyOrders do
  use Api, :resolver

  def handle(_args, %{context: %{current_central: central}}) do
    {:ok, todays_orders(central)}
  end

  def handle(_, _), do: {:error, "Algo errado, por favor refaça login"}
  def handle, do: {:error, "Algo errado, por favor refaça login"}

  defp todays_orders(central) do
    from(
      o in assoc(central, :orders),
      where: o.inserted_at >= ^Timex.beginning_of_day(Timex.local()),
      where: o.inserted_at <= ^Timex.end_of_day(Timex.local()),
      order_by: o.inserted_at
    )
    |> Repo.all()
  end
end
