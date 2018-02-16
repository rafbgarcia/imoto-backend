defmodule Graphql.Type.OrderCancelation do
  use Api, :graphql_schema

  object :order_cancelation do
    field(:id, :id)
    field(:reason, :string)
    field(:inserted_at, :datetime)
    field(:has_order_in_hands, :boolean)
    field(:motoboy, :motoboy, resolve: assoc(:motoboy))
  end
end
