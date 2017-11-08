defmodule Api.GraphqlSchema do
  use Absinthe.Schema
  import_types Api.Graphql.Types

  query do
    import_fields :orders_queries
    import_fields :motoboys_queries
    import_fields :customer_queries
  end

  mutation do
    import_fields :orders_mutations
  end

  subscription do
    field :motoboy_orders, :order do
      arg :auth_token, non_null(:string)

      config fn args, _ ->
        {:ok, topic: args.auth_token}
      end

      trigger :create_order, topic: fn order ->
        order.motoboy.auth_token
      end
    end
  end

end
