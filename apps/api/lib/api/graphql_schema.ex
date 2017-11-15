defmodule Api.GraphqlSchema do
  use Absinthe.Schema
  import_types Api.Graphql.Types

  query do
    import_fields :orders_queries
    import_fields :motoboys_queries
    import_fields :customer_queries
    import_fields :history_queries
  end

  mutation do
    import_fields :orders_mutations
    import_fields :motoboys_mutations
  end

  subscription do
    field :motoboy_orders, :order_or_error do
      config fn _args, socket ->
        {:ok, topic: socket.context.current_motoboy.id}
      end

      trigger :create_order, topic: fn order -> order.motoboy_id end
      trigger :cancel_order, topic: fn motoboy -> motoboy.id end
    end
  end

end
