defmodule Api.Graphql.Type.Location do
  use Api, :graphql_schema

  object :location do
    field :reference, :string
    field :line1, :string, resolve: &Api.Orders.Location.line1/3
    field :geocodable_address, :string, resolve: &Api.Orders.Location.geocodable_address/3
  end
end
