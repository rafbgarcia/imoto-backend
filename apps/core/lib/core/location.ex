defmodule Core.Location do
  use Core, :schema

  schema "locations" do
    belongs_to :stop, Core.Stop
    field :street, :string
    field :number, :string
    field :neighborhood, :string
    field :zipcode, :string
    field :complement, :string
    field :reference, :string
    field :city, :string
    field :uf, :string
    field :lat, :string
    field :lng, :string
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:street])
    |> validate_required([:street])
  end
end
