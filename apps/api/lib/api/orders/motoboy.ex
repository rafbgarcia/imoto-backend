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
end
