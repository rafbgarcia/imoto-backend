defmodule Api.Graphql.Type.Customer do
  use Api, :graphql_schema

  object :customer_queries do
    field :current_customer, :customer, resolve: &Api.Auth.Customer.current_or_new/2
  end

  object :customer do
    field :id, :id
    field :name, :string
    field :phone_number, :string
    field :auth_token, :string
  end
end
