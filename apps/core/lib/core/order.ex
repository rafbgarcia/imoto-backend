defmodule Core.Order do
  use Core, :schema

  def pending, do: "pending"
  def confirmed, do: "confirmed"
  def finished, do: "finished"
  def canceled, do: "canceled"
  def no_motoboys, do: "no_motoboys"

  schema "orders" do
    has_many :stops, Core.Stop
    has_many :locations, through: [:stops, :location]
    belongs_to :motoboy, Core.Motoboy
    belongs_to :company, Core.Company
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
      :canceled_at, :motoboy_id, :customer_id
    ])
    |> cast_assoc(:stops)
    |> validate_required([:state])
    |> validate_inclusion(:state, [pending(), confirmed(), finished(), canceled(), no_motoboys()])
  end
end
