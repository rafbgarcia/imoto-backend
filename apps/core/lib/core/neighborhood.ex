defmodule Core.Neighborhood do
  use Core, :schema

  schema "neighborhoods" do
    belongs_to(:city, Core.City)
    field(:name, :string)
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:name])
    |> validate_required([:name])
  end
end
