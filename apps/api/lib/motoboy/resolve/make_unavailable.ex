defmodule Motoboy.Resolve.MakeUnavailable do
  use Api, :resolver

  def handle(_args, %{context: %{current_motoboy: current_motoboy}}) do
    Motoboy.SharedFunctions.make_unavailable(current_motoboy)
  end
end
