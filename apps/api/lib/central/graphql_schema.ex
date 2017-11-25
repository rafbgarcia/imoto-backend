defmodule Central.GraphqlSchema do
  use Absinthe.Schema

  import_types Graphql.Type.Session

  query do
  end

  mutation do
    field :login, :session do
      arg :login, non_null(:string)
      arg :password, non_null(:string)

      resolve &Central.Resolve.Login.login/2
    end
  end
end
