defmodule Motoboy.Resolve.MakeUnavailable do
  use Api, :resolver

  alias Core.{History}

  def handle(_args, %{context: %{current_motoboy: current_motoboy}}) do
    add_to_history(current_motoboy.id)
    make_motoboy_unavailable(current_motoboy)
  end

  defp make_motoboy_unavailable(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{state: Core.Motoboy.unavailable(), became_unavailable_at: Timex.local})
    |> Repo.update
  end

  defp add_to_history(motoboy_id) do
    Repo.insert(%History{scope: "motoboy", text: "Ficou offline", motoboy_id: motoboy_id})
  end
end
