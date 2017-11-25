defmodule Core.Motoboy do
  use Core, :schema

  def busy, do: "busy"
  def available, do: "available"
  def unavailable, do: "unavailable"
  def confirming_order, do: "confirming_order"

  schema "motoboys" do
    belongs_to :central, Core.Central
    has_many :orders, Core.Order
    field :name, :string
    field :state, :string
    field :token, :string
    field :phone_number, :string
    field :became_available_at, Timex.Ecto.DateTime
    field :became_unavailable_at, Timex.Ecto.DateTime
    field :became_busy_at, Timex.Ecto.DateTime
    field :active, :boolean

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [
      :name, :token, :phone_number, :state,
      :became_available_at, :became_unavailable_at, :became_busy_at,
    ])
    |> validate_inclusion(:state, [busy(), available(), unavailable(), confirming_order()])
    |> validate_required([:name])
  end
end
