defmodule Motoboy.Resolve.GetMyData do
  use Api, :resolver
  alias Core.Motoboy

  def handle(_, %{context: %{current_motoboy: motoboy}}) do
    {:ok, motoboy}
  end
end
