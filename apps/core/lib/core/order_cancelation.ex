defmodule Core.OrderCancelation do
  use Core, :schema

  schema "order_cancelations" do
    belongs_to(:order, Core.Order)
    belongs_to(:motoboy, Core.Motoboy)
    field(:reason, :string)
    field(:has_order_in_hands, :boolean)
    field(:lat, :string)
    field(:lng, :string)
    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [
      :order_id,
      :motoboy_id,
      :reason,
      :has_order_in_hands,
      :lat,
      :lng
    ])
  end
end
