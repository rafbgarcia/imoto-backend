defmodule Central.Resolve.CreateCustomer do
  use Api, :resolver
  alias Core.CentralCustomer

  def handle(%{params: params}, %{context: %{current_central: central}}) do
    params
    |> Map.merge(%{central_id: central.id})
    |> create_customer
    |> case do
      {:ok, customer} -> {:ok, customer}
      {:error, customer} -> {:error, Api.ErrorHelper.messages(customer)}
    end
  end

  defp create_customer(params) do
    %CentralCustomer{}
    |> CentralCustomer.changeset(params)
    |> Repo.insert()
  end
end
