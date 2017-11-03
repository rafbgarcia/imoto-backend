defmodule Core.City do
  use Core, :schema

  schema "cities" do
    field :name, :string
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:name])
    |> validate_required([:name])
  end
end
