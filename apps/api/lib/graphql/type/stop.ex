defmodule Graphql.Type.Stop do
  use Api, :graphql_schema

  object :stop do
    field(:sequence, :integer)
    field(:instructions, :string)

    field(:reference, :string)
    field(:line1, :string, resolve: &Central.Resolve.Stop.Fields.line1/3)
    field(:street, :string)
    field(:number, :string)
    field(:neighborhood, :string)
    field(:zipcode, :string)
    field(:city, :string)
    field(:uf, :string)
    field(:complement, :string)

    @doc """
    @deprecated Doesn't exist anymore
    """
    field(:location, :location, resolve: fn(_, _) -> {:ok, %{}} end)
  end
end
