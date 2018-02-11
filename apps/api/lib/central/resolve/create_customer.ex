defmodule Central.Resolve.CreateCustomer do
  use Api, :resolver
  alias Core.CentralCustomer

  def handle(%{params: params}, %{context: %{current_central: central}}) do
    case create_customer(params, central.id) do
      {:ok, customer} -> {:ok, customer}
      {:error, customer} -> {:error, Api.ErrorHelper.messages(customer)}
    end
  end

  defp create_customer(params, central_id) do
    %CentralCustomer{}
    |> CentralCustomer.changeset(Map.merge(params, %{central_id: central_id}))
    |> Repo.insert()
  end
end
