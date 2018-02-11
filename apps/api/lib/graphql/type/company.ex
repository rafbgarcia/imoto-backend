defmodule Graphql.Type.Company do
  use Api, :graphql_schema

  object :company do
    field(:id, :id)
    field(:name, :string)
    field(:phone_number, :string)
    field(:email, :string)
    field(:token, :string)
    field(:location, :location, resolve: assoc(:location))
    field(:orders, list_of(:order), resolve: assoc(:orders))
    field(:customers, list_of(:customer), resolve: assoc(:customers))
    field(:centrals, list_of(:central), resolve: assoc(:centrals))
  end
end
