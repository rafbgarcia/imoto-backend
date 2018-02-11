defmodule Graphql.Type.Central do
  use Api, :graphql_schema

  object :central do
    field(:id, :id)
    field(:name, :string)
    field(:cnpj, :string)
    field(:email, :string)
    field(:phone_number, :string)
    field(:accepted_terms_of_use, :boolean)
    field(:token, :string)
    field(:motoboys, list_of(:motoboy), resolve: assoc(:motoboys))
  end
end
