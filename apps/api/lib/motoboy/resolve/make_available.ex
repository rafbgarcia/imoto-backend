defmodule Motoboy.Resolve.MakeAvailable do
  use Api, :resolver

  def handle(_args, %{context: %{current_motoboy: current_motoboy}}) do
    Motoboy.SharedFunctions.make_available(current_motoboy)
  end
end
