defmodule Core.Stop do
  use Core, :schema

  schema "stops" do
    has_one :location, Core.Location
    field :sequence, :integer
    field :instructions, :string
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:name])
    |> validate_required([:name])
  end
end
