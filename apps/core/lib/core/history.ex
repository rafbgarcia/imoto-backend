defmodule Core.History do
  use Core, :schema

  schema "history" do
    belongs_to :order, Core.Order
    belongs_to :motoboy, Core.Motoboy
    field :event, :string
    field :text, :string

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:event, :text, :motoboy_id, :order_id])
    |> validate_required([:event, :text])
  end
end
