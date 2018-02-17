defmodule Graphql.Type.OrderOrError do
  import Ecto.Query
  use Api, :graphql_schema

  object :order do
    field(:id, :id)
    field(:price, :integer)
    field(:formatted_price, :string, resolve: &Order.Resolve.Fields.formatted_price/3)
    field(:pending, :boolean, resolve: &Order.Resolve.Fields.pending/3)
    field(:confirmed, :boolean, resolve: &Order.Resolve.Fields.confirmed/3)
    field(:finished, :boolean, resolve: &Order.Resolve.Fields.finished/3)
    field(:canceled, :boolean, resolve: &Order.Resolve.Fields.canceled/3)
    field(:in_queue, :boolean, resolve: &Order.Resolve.Fields.in_queue/3)
    field(:confirmed_at, :datetime)
    field(:canceled_at, :datetime)
    field(:finished_at, :datetime)
    field(:queued_at, :datetime)
    field(:sent_at, :datetime)

    field(:customer, :customer, resolve: &Order.Resolve.GetCustomer.handle/3)
    field(:motoboy, :motoboy, resolve: assoc(:motoboy))

    field(
      :stops,
      list_of(:stop),
      resolve:
        assoc(:stops, fn query, _, _ ->
          query |> order_by(asc: :sequence)
        end)
    )

    field(
      :cancelations,
      list_of(:order_cancelation),
      resolve:
        assoc(:cancelations, fn query, _, _ ->
          query |> order_by(:inserted_at)
        end)
    )
  end
end
