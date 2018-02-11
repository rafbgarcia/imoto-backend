defmodule Central.Resolve.MyOrders do
  use Api, :resolver

  def handle(_args, %{context: %{current_central: current_central}}) do
    from(
      o in assoc(current_central, :orders),
      where: o.inserted_at >= ^Timex.beginning_of_day(Timex.local()),
      where: o.inserted_at <= ^Timex.end_of_day(Timex.local()),
      order_by: o.inserted_at
    )
    |> Repo.all()
    |> case do
      results -> {:ok, results}
    end
  end
end
