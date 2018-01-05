defmodule Api.GraphqlSchema do
  use Absinthe.Schema
  import_types Graphql.Types

  query do
    # import_fields :customer_queries
    import_fields :history_queries
  end

  mutation do
  end
end
