defmodule Graphql.Type.Location do
  use Api, :graphql_schema

  object :location do
    field :name, :string
    field :reference, :string
    field :street, :string
    field :number, :string
    field :neighborhood, :string
    field :zipcode, :string
    field :city, :string
    field :uf, :string
    field :complement, :string
    field :line1, :string, resolve: &Api.Orders.Location.line1/3
    field :geocodable_address, :string, resolve: &Api.Orders.Location.geocodable_address/3
  end
end
