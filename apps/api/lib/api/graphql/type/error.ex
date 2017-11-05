defmodule Api.Graphql.Type.Error do
  use Api, :graphql_schema

  object :error do
    field :error, :string
  end
end
