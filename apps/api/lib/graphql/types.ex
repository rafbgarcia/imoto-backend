defmodule Graphql.Types do
  use Absinthe.Schema.Notation

  import_types(Graphql.Field.Datetime)
  import_types(Graphql.Type.OrderOrError)
  import_types(Graphql.Type.Session)
  import_types(Graphql.Type.Error)
  import_types(Graphql.Type.Company)
  import_types(Graphql.Type.Order)
  import_types(Graphql.Type.Motoboy)
  import_types(Graphql.Type.Customer)
  import_types(Graphql.Type.Stop)
  import_types(Graphql.Type.Location)
  import_types(Graphql.Type.Central)
  import_types(Graphql.Type.History)
  import_types(Graphql.Type.CentralCustomer)
  import_types(Graphql.Type.MotoboyGeolocation)
end
