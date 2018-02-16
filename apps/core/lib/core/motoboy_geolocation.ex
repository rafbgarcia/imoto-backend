defmodule Core.MotoboyGeolocation do
  use Core, :schema

  schema "motoboy_geolocations" do
    belongs_to(:motoboy, Core.Motoboy)
    field(:lat, :string)
    field(:lng, :string)
    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [
      :motoboy_id,
      :lat,
      :lng,
    ])
  end
end
