defmodule Motoboy.GraphqlSchema do
  use Absinthe.Schema
  import_types Graphql.Types

  query do
  end

  mutation do
    field :request_code, :verification_response do
      arg :phone_number, non_null(:string)
      resolve &Motoboy.Resolve.SendVerificationCode.handle/2
    end

    field :verify_code, :motoboy do
      arg :params, :verify_code_params
      resolve &Motoboy.Resolve.VerifyCode.handle/2
    end
  end


  input_object :verify_code_params do
    field :request_id, non_null(:string)
    field :code, non_null(:string)
    field :phone_number, non_null(:string)
  end

  object :verification_response do
    field :request_id, non_null(:string)
  end
end
