defmodule Company.GraphqlSchema do
  use Absinthe.Schema
  import_types Graphql.Types

  query do
    field :orders, list_of(:order), resolve: &Company.Resolve.AllOrders.handle/2
  end

  mutation do
    field :create_order, :order do
      arg :order_params, :order_params
      arg :customer_params, :customer_params
      resolve &Company.Resolve.CreateOrder.handle/2
    end

    field :login, :company do
      arg :login, non_null(:string)
      arg :password, non_null(:string)
      resolve &Company.Resolve.Login.handle/2
    end

    field :logout, :company do
      arg :token, non_null(:string)
      resolve &Company.Resolve.Logout.handle/2
    end
  end

  input_object :order_params do
    field :stops, list_of(:stop_input)
  end
  input_object :customer_params do
    field :name, :string
    field :phone_number, :string
  end
  input_object :stop_input do
    field :sequence, :integer, description: "Used to organize the steps"
    field :instructions, :string
    field :location, :location_input
  end
  input_object :location_input do
    field :name, :string
    field :street, :string
    field :number, :string
    field :neighborhood, :string
    field :zipcode, :string
    field :complement, :string
    field :reference, :string
    field :city, :string
    field :country, :string
    field :uf, :string
    field :lat, :float
    field :lng, :float
    field :place_id, :string, description: "Google's"
    field :formatted_address, :string, description: "Google's"
    field :formatted_phone_number, :string, description: "Google's"
  end
end
