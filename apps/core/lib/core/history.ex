defmodule Core.History do
  use Core, :schema

  schema "history" do
    belongs_to :order, Core.Order
    belongs_to :motoboy, Core.Motoboy
    field :text, :string

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:name])
    |> validate_required([:name])
  end
end
