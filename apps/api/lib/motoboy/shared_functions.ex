defmodule Motoboy.SharedFunctions do
  use Api, :resolver

  alias Core.{Order, History}

  def make_available(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{state: Core.Motoboy.available(), became_available_at: Timex.local})
    |> Repo.update
    |> case do
      {:ok, motoboy} ->
        Repo.insert(%History{scope: "motoboy", text: "Ficou online", motoboy_id: motoboy.id})
        {:ok, motoboy}
    end
  end

  def make_unavailable(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{state: Core.Motoboy.unavailable(), became_unavailable_at: Timex.local})
    |> Repo.update
    |> case do
      {:ok, motoboy} ->
        Repo.insert(%History{scope: "motoboy", text: "Ficou offline", motoboy_id: motoboy.id})
        {:ok, motoboy}
    end
  end

  def get_order!(order_id, motoboy_id) do
    from(o in Order,
      where: o.id == ^order_id,
      where: o.motoboy_id == ^motoboy_id,
    )
    |> first
    |> Repo.one!
  end
end
