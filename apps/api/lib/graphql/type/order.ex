defmodule Graphql.Type.OrderOrError do
  use Api, :graphql_schema

  # Objects
  object :order do
    field(:id, :id)
    field(:price, :integer)
    field(:formatted_price, :string, resolve: &Order.Resolve.Fields.formatted_price/3)
    field(:pending, :boolean, resolve: &Order.Resolve.Fields.pending/3)
    field(:confirmed, :boolean, resolve: &Order.Resolve.Fields.confirmed/3)
    field(:finished, :boolean, resolve: &Order.Resolve.Fields.finished/3)
    field(:in_queue, :boolean, resolve: &Order.Resolve.Fields.in_queue/3)
    field(:inserted_at, :datetime)
    field(:confirmed_at, :datetime)
    field(:canceled_at, :datetime)
    field(:finished_at, :datetime)

    field(:customer, :customer, resolve: &Order.Resolve.GetCustomer.handle/3)
    # field(:central_customer, :central_customer, resolve: assoc(:central_customer))
    # field(:company, :company, resolve: assoc(:company))
    field(:motoboy, :motoboy, resolve: assoc(:motoboy))
    field(:stops, list_of(:stop), resolve: &Order.Resolve.Fields.stops/3)
  end
end
