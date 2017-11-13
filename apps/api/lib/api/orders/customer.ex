defmodule Api.Orders.Customer do
  use Api, :context
  alias Core.Customer

  def update(customer, params) do
    customer
    |> Customer.changeset(params)
    |> Repo.update
  end
end
