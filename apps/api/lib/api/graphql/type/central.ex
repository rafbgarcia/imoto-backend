defmodule Api.Graphql.Type.Central do
  use Api, :graphql_schema

  object :central do
    field :id, :id
    field :name, :string
    field :motoboys, list_of(:motoboy), resolve: assoc(:motoboys)
  end
end
