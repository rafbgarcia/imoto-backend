defmodule Core.Motoboy do
  use Core, :schema

  def busy, do: "busy"
  def available, do: "available"
  def unavailable, do: "unavailable"
  def confirming_order, do: "confirming_order"

  schema "motoboys" do
    belongs_to(:central, Core.Central)
    has_many(:orders, Core.Order)
    has_many(:geolocations, Core.MotoboyGeolocation)
    field(:name, :string)
    field(:state, :string)
    field(:phone_number, :string)
    field(:one_signal_player_id, :string)
    field(:lat, :string)
    field(:lng, :string)
    field(:became_available_at, Timex.Ecto.DateTime)
    field(:became_unavailable_at, Timex.Ecto.DateTime)
    field(:became_busy_at, Timex.Ecto.DateTime)
    field(:active, :boolean)
    field(:token, :string, virtual: true)

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [
      :central_id,
      :name,
      :phone_number,
      :one_signal_player_id,
      :lat,
      :lng,
      :state,
      :active,
      :became_available_at,
      :became_unavailable_at,
      :became_busy_at
    ])
    |> validate_required([:name, :phone_number])
    |> unique_constraint(:phone_number)
    |> validate_inclusion(:state, [busy(), available(), unavailable(), confirming_order()])
  end
end
