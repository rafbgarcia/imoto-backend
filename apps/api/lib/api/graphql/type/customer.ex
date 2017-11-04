defmodule Api.Graphql.Type.Customer do
  use Api, :graphql_schema

  object :customer do
    field :id, :id
    field :name, :string
    field :phone_number, :string
  end
end
