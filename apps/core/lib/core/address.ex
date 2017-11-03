defmodule Core.Address do
  use Core, :schema

  schema "addresses" do
    field :zipcode, :string
    field :uf, :string
    field :city, :string
    field :neighborhood, :string
    field :street, :string
    field :lat, :string
    field :lng, :string
    field :ibge_cod_uf, :string
    field :ibge_cod_cidade, :string
    field :area_cidade_km2, :string
    field :ddd, :string
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:street])
    |> validate_required([:street])
  end
end
