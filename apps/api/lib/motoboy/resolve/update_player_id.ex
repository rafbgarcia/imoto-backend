defmodule Motoboy.Resolve.UpdatePlayerId do
  use Api, :resolver

  def handle(%{player_id: player_id}, %{context: %{current_motoboy: motoboy}}) do
    motoboy
    |> Core.Motoboy.changeset(%{one_signal_player_id: player_id})
    |> Repo.update

    {:ok, motoboy}
  end
end
