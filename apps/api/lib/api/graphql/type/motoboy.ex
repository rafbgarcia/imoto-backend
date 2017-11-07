defmodule Api.Graphql.Type.Motoboy do
  use Api, :graphql_schema
  import_types Api.Graphql.Field.Datetime

  object :motoboys_queries do
    # TODO: scope this query by Central
    field :motoboys, list_of(:motoboy), resolve: &Api.Orders.Motoboy.all/2
    field :current_motoboy, :motoboy, resolve: &Api.Auth.Motoboy.current_or_new/2
  end

  object :motoboy do
    field :name, :string
    field :busy, :boolean, resolve: &Api.Orders.Motoboy.busy/3
    field :available, :boolean, resolve: &Api.Orders.Motoboy.available/3
    field :unavailable, :boolean, resolve: &Api.Orders.Motoboy.unavailable/3
    field :became_available_at, :datetime
    field :became_busy_at, :datetime

    field :central, :central, resolve: assoc(:central)
  end
end
