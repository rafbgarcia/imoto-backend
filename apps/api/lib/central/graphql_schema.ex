defmodule Central.GraphqlSchema do
  use Absinthe.Schema

  import_types Graphql.Field.Datetime
  import_types Graphql.Type.OrderOrError
  import_types Graphql.Type.Error
  import_types Graphql.Type.Session
  import_types Graphql.Type.Order
  import_types Graphql.Type.Motoboy
  import_types Graphql.Type.Stop
  import_types Graphql.Type.Location
  import_types Graphql.Type.Customer
  import_types Graphql.Type.Central

  query do
    field :orders, list_of(:order), resolve: &Api.Orders.Order.for_central/2
    field :motoboys, list_of(:motoboy), resolve: &Api.Orders.Motoboy.all/2
  end

  mutation do
    field :login, :session do
      arg :login, non_null(:string)
      arg :password, non_null(:string)
      resolve &Central.Resolve.Login.login/2
    end

    field :logout, :session do
      arg :token, non_null(:string)
      resolve &Central.Resolve.Logout.logout/2
    end
  end
end
