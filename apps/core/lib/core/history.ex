defmodule Core.History do
  use Core, :schema

  schema "history" do
    belongs_to(:order, Core.Order)
    belongs_to(:motoboy, Core.Motoboy)
    field(:scope, :string)
    field(:text, :string)

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:scope, :text, :motoboy_id, :order_id])
    |> validate_required([:scope, :text])
  end
end
