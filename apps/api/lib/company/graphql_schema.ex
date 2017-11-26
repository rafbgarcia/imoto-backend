defmodule Company.GraphqlSchema do
  use Absinthe.Schema
  import_types Graphql.Types

  query do
    field :orders, list_of(:order), resolve: &Company.Resolve.Order.all/2
  end

  mutation do
    field :login, :company do
      arg :login, non_null(:string)
      arg :password, non_null(:string)
      resolve &Company.Resolve.Login.login/2
    end

    field :logout, :company do
      arg :token, non_null(:string)
      resolve &Company.Resolve.Logout.logout/2
    end
  end
end
