defmodule Graphql.Type.Stop do
  use Api, :graphql_schema

  object :stop do
    field(:sequence, :integer)
    field(:instructions, :string)

    field(:reference, :string)
    field(:street, :string)
    field(:number, :string)
    field(:neighborhood, :string)
    field(:zipcode, :string)
    field(:city, :string)
    field(:uf, :string)
    field(:complement, :string)
  end
end
