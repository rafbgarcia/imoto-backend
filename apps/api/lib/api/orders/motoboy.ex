defmodule Api.Orders.Motoboy do
  use Api, :context

  def all(_args, _ctx) do
    {:ok, Core.Motoboy |> Db.Repo.all }
  end

  def available(motoboy, _args, _ctx) do
    {:ok, motoboy.state == "available" }
  end

  def unavailable(motoboy, _args, _ctx) do
    {:ok, motoboy.state == "unavailable" }
  end

  def busy(motoboy, _args, _ctx) do
    {:ok, motoboy.state == "busy" }
  end

  def next_in_queue do
    Core.Motoboy
    # |> where([central_id: central_id])
    |> where([state: "available"])
    |> first([desc: :became_available_at])
    |> Repo.one!
  end

  def mark_busy!(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{state: "busy", became_busy_at: Timex.local})
    |> Repo.update!
  end
end
