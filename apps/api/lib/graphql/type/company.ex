defmodule Graphql.Type.Company do
  use Api, :graphql_schema

  object :company do
    field :id, :id
    field :name, :string
    field :phone_number, :string
    field :login, :string
    field :token, :string
    field :locations, list_of(:location), resolve: assoc(:locations)
    field :orders, list_of(:order), resolve: assoc(:orders)
    field :customers, list_of(:customer), resolve: assoc(:customers)
    field :centrals, list_of(:central), resolve: assoc(:centrals)
  end
end
