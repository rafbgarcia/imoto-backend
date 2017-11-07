defmodule Api.Graphql.Type.Order do
  use Api, :graphql_schema
  import_types Api.Graphql.Field.Datetime

  # Queries
  object :orders_queries do
    @desc "Get orders"
    field :orders, list_of(:order) do
      # TODO: can't be all here, must be orders per Central since last opened
      resolve &Api.Orders.Order.all/2
    end
  end


  # Mutations
  input_object :order_params do
    field :stops, list_of(:stop)
  end
  input_object :stop do
    field :sequence, :integer, description: "Used to organize the steps"
    field :instructions, :string
    field :location, :location
  end
  input_object :location do
    field :place_id, :string, description: "Google's place_id for fetching its information"
  #   field :street, :string
  #   field :number, :string
  #   field :neighborhood, :string
  #   field :zipcode, :string
  #   field :complement, :string
  #   field :reference, :string
  #   field :city, :string
  #   field :uf, :string
  #   field :lat, :string
  #   field :lng, :string
  end

  union :order_or_error do
    types [:error, :order]
    resolve_type fn
      %Core.Order{}, _ -> :order
      %{error: _}, _ -> :error
    end
  end

  object :orders_mutations do
    field :create_order, :order_or_error do
      arg :params, :order_params
      resolve &Api.Orders.Order.create/2
    end

    field :confirm_order, :order_or_error do
      arg :order_id, :integer
      resolve &Api.Orders.Order.confirm/2
    end

    field :cancel_order, :error do
      arg :order_id, :integer
      resolve &Api.Orders.Order.cancel/2
    end
  end


  # Objects
  object :order do
    field :id, :id
    field :price, :float
    field :formatted_price, :string, resolve: &Api.Orders.Order.formatted_price/3
    field :pending, :boolean, resolve: &Api.Orders.Order.pending/3
    field :confirmed, :boolean, resolve: &Api.Orders.Order.confirmed/3
    field :inserted_at, :datetime
    field :confirmed_at, :datetime
    field :canceled_at, :datetime
    field :finished_at, :datetime

    field :customer, :customer, resolve: assoc(:customer)
    field :motoboy, :motoboy, resolve: assoc(:motoboy)
    field :stops, list_of(:stop), resolve: assoc(:stops)
  end
end
