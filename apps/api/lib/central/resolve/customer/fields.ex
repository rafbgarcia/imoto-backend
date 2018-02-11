defmodule Central.Resolve.Customer.Fields do
  use Api, :resolver

  def line1(customer, _, _) do
    {:ok, line1(customer)}
  end

  defp line1(customer) do
    [
      customer.street,
      customer.number,
      customer.complement,
      customer.neighborhood
    ]
    |> Enum.reject(&is_nil/1)
    |> Enum.join(", ")
  end
end
