defmodule Graphql.Type.Stop do
  use Api, :graphql_schema

  object :stop do
    field :sequence, :integer
    field :instructions, :string
    field :location, :location, resolve: assoc(:location)
  end
end
