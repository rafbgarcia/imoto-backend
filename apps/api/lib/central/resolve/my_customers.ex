defmodule Central.Resolve.MyCustomers do
  use Api, :resolver

  alias Core.{CentralCustomer}

  def handle(_, %{context: %{current_central: current_central}}) do
    {:ok, all(current_central.id)}
  end

  defp all(central_id) do
    from(
      c in CentralCustomer,
      where: c.central_id == ^central_id,
      order_by: c.name
    )
    |> Repo.all()
  end
end
