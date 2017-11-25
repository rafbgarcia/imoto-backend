defmodule Graphql.Type.OrderOrError do
  use Api, :graphql_schema

  # Queries
  object :orders_queries do
    field :order, :order_or_error do
      arg :id, non_null(:id)
      resolve &Api.Orders.Order.get/2
    end
  end


  # Mutations
  input_object :customer_params do
    field :name, :string
    field :phone_number, :string
  end
  input_object :order_params do
    field :stops, list_of(:stop_input)
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

  object :orders_mutations do
    field :create_order, :order_or_error do
      arg :params, :order_params
      arg :customer_params, :customer_params
      resolve &Api.Orders.Order.create/2
    end

    field :confirm_order, :order_or_error do
      arg :order_id, non_null(:id)
      resolve &Api.Orders.Order.confirm/2
    end

    field :cancel_order, :motoboy do
      arg :order_id, non_null(:id)
      arg :reason, :string
      resolve &Api.Orders.Order.cancel/2
    end

    field :finish_order, :order_or_error do
      arg :order_id, non_null(:id)
      resolve &Api.Orders.Order.finish/2
    end
  end


  # Objects
  object :order do
    field :id, :id
    field :price, :float
    field :formatted_price, :string, resolve: &Api.Orders.Order.formatted_price/3
    field :pending, :boolean, resolve: &Api.Orders.Order.pending/3
    field :confirmed, :boolean, resolve: &Api.Orders.Order.confirmed/3
    field :canceled, :boolean, resolve: &Api.Orders.Order.canceled/3
    field :finished, :boolean, resolve: &Api.Orders.Order.finished/3
    field :no_motoboy, :boolean, resolve: &Api.Orders.Order.no_motoboy/3
    field :inserted_at, :datetime
    field :confirmed_at, :datetime
    field :canceled_at, :datetime
    field :finished_at, :datetime

    field :customer, :customer, resolve: assoc(:customer)
    field :motoboy, :motoboy, resolve: assoc(:motoboy)
    field :stops, list_of(:stop), resolve: assoc(:stops)
  end
end
