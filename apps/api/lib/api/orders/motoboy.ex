defmodule Api.Orders.Motoboy do
  use Api, :context

  def all(_args, _ctx) do
    {:ok, Core.Motoboy |> Db.Repo.all }
  end
end
