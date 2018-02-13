defmodule Central.Resolve.Stop.Fields do
  use Api, :resolver

  def line1(stop, _, _) do
    {:ok, line1(stop)}
  end
  defp line1(stop) do
    [
      stop.street,
      stop.number,
      stop.complement,
      stop.neighborhood
    ]
    |> Enum.reject(&is_nil/1)
    |> Enum.join(", ")
  end
end
