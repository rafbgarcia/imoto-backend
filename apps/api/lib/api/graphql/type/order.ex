defmodule Api.Graphql.Type.Order do
  use Api, :graphql_schema
  import_types Api.Graphql.Field.Datetime

  object :orders_queries do
    @desc "Get orders"
    field :orders, list_of(:order) do
      # TODO: can't be all here, must be orders per Central since last opened
      resolve &Api.Orders.Order.all/2
    end
  end

  object :order do
    field :id, :id
    field :price, :float
    field :pending, :boolean, resolve: &Api.Orders.Order.pending/3
    field :confirmed, :boolean, resolve: &Api.Orders.Order.confirmed/3
    field :ordered_at, :string, resolve: &Api.Orders.Order.ordered_at/3
    field :inserted_at, :datetime
    field :confirmed_at, :datetime
    field :canceled_at, :datetime
    field :finished_at, :datetime

    field :customer, :customer, resolve: assoc(:customer)
    field :motoboy, :motoboy, resolve: assoc(:motoboy)
    field :stops, list_of(:stop), resolve: assoc(:stops)
  end
end
