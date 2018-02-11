defmodule Graphql.Type.Order do
  use Api, :graphql_schema
  alias Core.Order

  union :order_or_error do
    types([:error, :order])

    resolve_type(fn
      %Order{}, _ -> :order
      %{error: _}, _ -> :error
    end)
  end
end
