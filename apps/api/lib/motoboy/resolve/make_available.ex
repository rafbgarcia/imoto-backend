defmodule Motoboy.Resolve.MakeAvailable do
  use Api, :resolver

  alias Core.{History}

  def handle(_args, %{context: %{current_motoboy: current_motoboy}}) do
    add_to_history(current_motoboy.id)
    make_motoboy_available(current_motoboy)
  end

  defp make_motoboy_available(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{
      state: Core.Motoboy.available(),
      became_available_at: Timex.local()
    })
    |> Repo.update()
  end

  defp add_to_history(motoboy_id) do
    Repo.insert(%History{scope: "motoboy", text: "Ficou online", motoboy_id: motoboy_id})
  end
end
