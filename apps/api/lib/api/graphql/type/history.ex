defmodule Api.Graphql.Type.History do
  use Api, :graphql_schema
  import_types Api.Graphql.Field.Datetime

  object :history_queries do
    field :motoboy_history, list_of(:history) do
      arg :motoboy_id, non_null(:id)
      resolve &Api.Orders.History.all_of_motoboy/2
    end
  end

  object :history do
    field :id, :id
    field :scope, :string
    field :text, :string
    field :order_id, :id
    field :motoboy_id, :string
    field :inserted_at, :string

    field :order, :order, resolve: assoc(:order)
    field :motoboy, :motoboy, resolve: assoc(:motoboy)
  end
end
