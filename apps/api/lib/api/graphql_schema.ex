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
    field :new_order, :order do
      arg :user_id, non_null(:id)

      config fn args, _ ->
        {:ok, topic: args.user_id}
      end
    end
  end

end
