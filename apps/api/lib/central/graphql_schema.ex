defmodule Central.GraphqlSchema do
  use Absinthe.Schema
  import_types Graphql.Types

  query do
    field :orders, list_of(:order), resolve: &Central.Resolve.MyOrders.handle/2
    field :motoboys, list_of(:motoboy), resolve: &Central.Resolve.MyMotoboys.handle/2
  end

  mutation do
    field :login, :central do
      arg :login, non_null(:string)
      arg :password, non_null(:string)
      resolve &Central.Resolve.Login.handle/2
    end

    field :logout, :central do
      arg :token, non_null(:string)
      resolve &Central.Resolve.Logout.handle/2
    end

    field :create_motoboy, :motoboy do
      arg :params, :motoboy_create_params
      resolve &Central.Resolve.CreateMotoboy.handle/2
    end

    field :update_motoboy, :motoboy do
      arg :id, non_null(:id)
      arg :params, :motoboy_update_params
      resolve &Central.Resolve.UpdateMotoboy.handle/2
    end
  end

  input_object :motoboy_create_params do
    field :name, non_null(:string)
    field :phone_number, non_null(:string)
  end

  input_object :motoboy_update_params do
    field :name, non_null(:string)
    field :phone_number, non_null(:string)
    field :active, non_null(:boolean)
  end
end
