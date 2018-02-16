defmodule Graphql.Type.Motoboy do
  import Ecto.Query
  use Api, :graphql_schema

  object :motoboy do
    field(:id, :id)
    field(:first_name, :string, resolve: &Motoboy.Resolve.MyData.first_name/3)
    field(:name, :string)
    field(:one_signal_player_id, :string)
    field(:token, :string)
    field(:phone_number, :string)
    field(:became_available_at, :datetime)
    field(:became_unavailable_at, :datetime)
    field(:became_busy_at, :datetime)
    field(:active, :boolean)
    field(:busy, :boolean, resolve: &Motoboy.Resolve.MyData.busy/3)
    field(:available, :boolean, resolve: &Motoboy.Resolve.MyData.available/3)
    field(:unavailable, :boolean, resolve: &Motoboy.Resolve.MyData.unavailable/3)

    field(:central, :central, resolve: assoc(:central))
    field(:geolocations, list_of(:motoboy_geolocation), resolve: assoc(:geolocations))
  end
end
