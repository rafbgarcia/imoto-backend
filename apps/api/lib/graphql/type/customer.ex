defmodule Graphql.Type.Customer do
  use Api, :graphql_schema

  object :customer_queries do
  end

  object :customer do
    field(:id, :id)
    field(:name, :string)
    field(:phone_number, :string)
    field(:auth_token, :string)
  end
end
