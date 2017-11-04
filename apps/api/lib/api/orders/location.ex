defmodule Api.Orders.Location do
  use Api, :context

  def line1(location, _args, _ctx) do
    {:ok, line1(location) }
  end

  defp line1(location) do
    [
      location.street,
      location.number,
      location.complement,
      location.neighborhood
    ]
    |> Enum.reject(&is_nil/1)
    |> Enum.join(", ")
  end
end
