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
end
