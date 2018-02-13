defmodule Order.Resolve.GetCustomer do
  use Api, :resolver
  alias Core.{CentralCustomer, Customer, Company}

  def handle(order, _, _) do
    case order do
      %{company_id: id} when is_integer(id) ->
        {:ok, get_company(id)}
      %{customer_id: id} when is_integer(id) ->
        {:ok, get_customer(id)}
      %{central_customer_id: id} when is_integer(id) ->
        {:ok, get_central_customer(id)}
    end
  end

  defp get_company(id), do: Repo.get(Company, id)
  defp get_customer(id), do: Repo.get(Customer, id)
  defp get_central_customer(id), do: Repo.get(CentralCustomer, id)
end
