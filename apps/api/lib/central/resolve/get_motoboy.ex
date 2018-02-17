defmodule Central.Resolve.GetMotoboy do
  use Api, :resolver

  alias Core.{Motoboy}

  def handle(%{id: id}, %{context: %{current_central: _}}) do
    {:ok, Repo.get(Motoboy,id)}
  end
end
