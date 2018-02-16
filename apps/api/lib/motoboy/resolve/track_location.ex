defmodule Motoboy.Resolve.TrackLocation do
  use Api, :resolver

  alias Core.{MotoboyGeolocation}

  def handle(%{params: params}, %{context: %{current_motoboy: motoboy}}) do
    motoboy
    |> update_current_location(params)
    |> insert_to_geolocations(params)
  end

  defp update_current_location(motoboy, params) do
    motoboy
    |> Core.Motoboy.changeset(params)
    |> Repo.update!()
  end

  defp insert_to_geolocations(%Core.Motoboy{id: motoboy_id}, params) do
    %MotoboyGeolocation{}
    |> MotoboyGeolocation.changeset(params)
    |> MotoboyGeolocation.changeset(%{motoboy_id: motoboy_id})
    |> Repo.insert()
  end
end
