defmodule Core.Stop do
  use Core, :schema

  schema "stops" do
    belongs_to :order, Core.Order
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
