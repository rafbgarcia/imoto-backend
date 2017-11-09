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

  def geocodable_address(location, _args, _ctx) do
    {:ok, geocodable_address(location)}
  end
  defp geocodable_address(location) do
    [
      location.street,
      location.number,
      location.neighborhood,
      location.zipcode,
      location.city,
      location.uf,
      "Brasil",
    ]
    |> Enum.reject(&is_nil/1)
    |> Enum.join(", ")
  end
end
