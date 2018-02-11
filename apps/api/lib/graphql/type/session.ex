defmodule Graphql.Type.Session do
  use Api, :graphql_schema

  object :session do
    field(:token, :string)
  end
end
