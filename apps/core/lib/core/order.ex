defmodule Core.Order do
  use Core, :schema

  schema "orders" do
    has_many :stops, Core.Stop
    has_many :locations, through: [:stops, :location]
    belongs_to :motoboy, Core.Motoboy
    belongs_to :customer, Core.Customer
    field :price, Money.Ecto.Type
    field :state, :string
    field :confirmed_at, Timex.Ecto.DateTime
    field :finished_at, Timex.Ecto.DateTime
    field :canceled_at, Timex.Ecto.DateTime

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [
      :price, :state, :confirmed_at, :finished_at,
      :canceled_at, :motoboy_id, :customer_id,
    ])
    |> validate_required([:price, :state, :customer_id])
    |> validate_inclusion(:state, ["pending", "confirmed", "finished", "canceled", "no_motoboy"])
  end
end
