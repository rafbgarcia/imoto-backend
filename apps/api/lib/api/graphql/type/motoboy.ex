defmodule Api.Graphql.Type.Motoboy do
  use Api, :graphql_schema
  import_types Api.Graphql.Field.Datetime

  object :motoboys_queries do
    @desc "Get orders"
    field :motoboys, list_of(:motoboy) do
      # TODO: scope this query by Central
      resolve &Api.Orders.Motoboy.all/2
    end
  end

  object :motoboy do
    field :name, :string
    field :state, :string
    field :last_available_at, :datetime
    field :last_busy_at, :datetime
  end
end
