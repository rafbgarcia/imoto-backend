defmodule Company.GraphqlSchema do
  use Absinthe.Schema
  import_types Graphql.Types

  query do
  end

  mutation do
    field :login_with_code, :motoboy do
      arg :params, :nexmo_params
      resolve &Motooby.Resolve.LoginWithCode.handle/2
    end
  end

  input_object :nexmo_params do
    field :code, non_null(:string)
    field :request_id, non_null(:string)
  end
end
