defmodule Api.Graphql.Types do
  use Absinthe.Schema.Notation

  import_types Api.Graphql.Type.Error

  import_types Api.Graphql.Type.Order
  import_types Api.Graphql.Type.Motoboy
  import_types Api.Graphql.Type.Customer
  import_types Api.Graphql.Type.Stop
  import_types Api.Graphql.Type.Location
  import_types Api.Graphql.Type.Central
end
