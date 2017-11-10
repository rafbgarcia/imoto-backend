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
    import_fields :motoboys_mutations
  end

  subscription do
    field :motoboy_state, :motoboy do
      config fn _args, socket ->
        {:ok, topic: socket.context.current_motoboy.id}
      end
    end

    field :motoboy_orders, :order_or_error do
      config fn _args, socket ->
        {:ok, topic: socket.context.current_motoboy.id}
      end

      trigger :confirm_order, topic: fn order ->
        order.motoboy_id
      end
    end

    field :motoboy_updates, :motoboy do
      config fn _args, socket ->
        {:ok, topic: socket.context.current_central.id}
      end

      trigger :make_motoboy_available, topic: fn motoboy ->
        motoboy.central_id
      end

      trigger :make_motoboy_unavailable, topic: fn motoboy ->
        motoboy.central_id
      end
    end

    # field :customer_order, :order_or_error do
    #   config fn _args, socket ->
    #     {:ok, topic: socket.context.current_customer.id}
    #   end

    #   trigger :confirm_order, topic: fn order ->
    #     order.customer_id
    #   end
    # end

    # field :central_orders, :order_or_error do
    #   config fn _args, socket ->
    #     {:ok, topic: socket.context.current_central.id}
    #   end

    #   trigger :confirm_order, topic: fn order ->
    #     order.motoboy.central_id
    #   end
    # end

    # field :central_motoboys, :motoboy do
    #   config fn _args, socket ->
    #     {:ok, topic: socket.context.current_central.id}
    #   end
    # end
  end

end
