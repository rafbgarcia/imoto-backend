defmodule Central.GraphqlSchema do
  use Absinthe.Schema
  import_types Graphql.Types

  query do
    field :orders, list_of(:order), resolve: &Central.Resolve.MyOrders.handle/2
    field :motoboys, list_of(:motoboy), resolve: &Central.Resolve.MyMotoboys.handle/2
    field :my_companies, list_of(:company), resolve: &Central.Resolve.MyCompanies.handle/2
  end

  mutation do
    field :register, :central do
      arg :params, :central_params
      resolve &Central.Resolve.Register.handle/2
    end

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

    field :create_order_for_existing_company, :order do
      arg :company_id, non_null(:id)
      resolve &Central.Resolve.CreateOrderForExistingCompany.handle/2
    end

    field :create_order_for_new_company, :order do
      arg :company_params, :company_params
      resolve &Central.Resolve.CreateOrderForNewCompany.handle/2
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

  input_object :company_params do
    field :name, :string
    field :phone_number, :string
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
    field :uf, :string
  end

  input_object :central_params do
    field :name, :string
    field :email, :string
    field :cnpj, :string
    field :phone_number, :string
    field :password, :string
    field :accepted_terms_of_use, :boolean
  end
end
