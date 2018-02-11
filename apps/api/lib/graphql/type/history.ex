defmodule Graphql.Type.History do
  use Api, :graphql_schema

  object :history do
    field(:id, :id)
    field(:scope, :string)
    field(:text, :string)
    field(:order_id, :id)
    field(:motoboy_id, :string)
    field(:inserted_at, :string)

    field(:order, :order, resolve: assoc(:order))
    field(:motoboy, :motoboy, resolve: assoc(:motoboy))
  end
end
