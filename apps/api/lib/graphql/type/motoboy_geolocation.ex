defmodule Graphql.Type.MotoboyGeolocation do
  use Api, :graphql_schema

  object :motoboy_geolocation do
    field(:id, :id)
    field(:latitude, :string)
    field(:longitude, :string)
    field(:motoboy, :motoboy, resolve: assoc(:motoboy))
  end
end
