defmodule Api.Orders.Location do
  use Api, :context
  alias Core.Location

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

  def after_create_order(order) do
    Repo.all(assoc(order, :locations))
    |> Enum.each(fn location ->
      Core.Location.changeset(location, %{
        last_used_at: Timex.local,
        customer_id: order.customer_id,
        used_count: case location.used_count do
          nil -> 1
          count -> count + 1
        end
      })
      |> Repo.update
    end)
  end
end
