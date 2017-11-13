defmodule Api.Graphql.Type.Motoboy do
  use Api, :graphql_schema
  import_types Api.Graphql.Field.Datetime

  object :motoboys_queries do
    # TODO: scope this query by Central
    field :motoboys, list_of(:motoboy), resolve: &Api.Orders.Motoboy.all/2
    field :current_motoboy, :motoboy, resolve: &Api.Orders.Motoboy.current/2
  end

  object :motoboys_mutations do
    field :make_motoboy_available, :motoboy, resolve: &Api.Orders.Motoboy.make_available_and_publish/2
    field :make_motoboy_unavailable, :motoboy, resolve: &Api.Orders.Motoboy.make_unavailable_and_publish/2
  end

  object :motoboy do
    field :id, :id
    field :first_name, :string, resolve: &Api.Orders.Motoboy.first_name/3
    field :name, :string
    field :auth_token, :string
    field :phone_number, :string
    field :busy, :boolean, resolve: &Api.Orders.Motoboy.busy/3
    field :available, :boolean, resolve: &Api.Orders.Motoboy.available/3
    field :unavailable, :boolean, resolve: &Api.Orders.Motoboy.unavailable/3
    field :became_available_at, :datetime
    field :became_busy_at, :datetime
    field :current_order, :order, resolve: &Api.Orders.Motoboy.current_order/3

    field :central, :central, resolve: assoc(:central)
  end
end
