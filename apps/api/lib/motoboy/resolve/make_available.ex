defmodule Motoboy.Resolve.MakeAvailable do
  use Api, :resolver

  alias Core.{History}

  def handle(_args, %{context: %{current_motoboy: motoboy}}) do
    Repo.transaction(fn ->
      motoboy
      |> track_became_online
      |> become_available!
    end)
  end

  defp become_available!(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{state: Core.Motoboy.available()})
    |> Core.Motoboy.changeset(%{became_available_at: Timex.local()})
    |> Repo.update!()
  end

  defp track_became_online(motoboy) do
    Repo.insert(%History{scope: "motoboy", text: "Ficou online", motoboy_id: motoboy.id})
    motoboy
  end
end
