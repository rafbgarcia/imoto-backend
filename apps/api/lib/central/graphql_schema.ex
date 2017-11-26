defmodule Central.GraphqlSchema do
  use Absinthe.Schema
  import_types Graphql.Types

  query do
    field :orders, list_of(:order), resolve: &Api.Orders.Order.for_central/2
    field :motoboys, list_of(:motoboy), resolve: &Api.Orders.Motoboy.all/2
  end

  mutation do
    field :login, :central do
      arg :login, non_null(:string)
      arg :password, non_null(:string)
      resolve &Central.Resolve.Login.login/2
    end

    field :logout, :central do
      arg :token, non_null(:string)
      resolve &Central.Resolve.Logout.logout/2
    end
  end
end
