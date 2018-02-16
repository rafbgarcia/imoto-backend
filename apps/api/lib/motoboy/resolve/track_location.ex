defmodule Motoboy.Resolve.TrackLocation do
  use Api, :resolver

  alias Core.{MotoboyGeolocation}

  def handle(%{params: params}, %{context: %{current_motoboy: motoboy}}) do
    motoboy
    |> track(params)
  end

  defp track(%Core.Motoboy{id: motoboy_id}, params) do
    %MotoboyGeolocation{}
    |> MotoboyGeolocation.changeset(params)
    |> MotoboyGeolocation.changeset(%{motoboy_id: motoboy_id})
    |> Repo.insert()
  end
end
