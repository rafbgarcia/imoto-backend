defmodule Api.Orders.History do
  use Api, :context
  alias Core.History

  def all_of_motoboy(%{motoboy_id: motoboy_id}, _) do
    from(h in History,
      where: h.motoboy_id == ^motoboy_id,
      where: h.scope in ["motoboy"],
      where: h.inserted_at >= ^Timex.beginning_of_day(Timex.local),
      where: h.inserted_at <= ^Timex.end_of_day(Timex.local),
      order_by: [asc: :inserted_at],
    )
    |> Repo.all
    |> case do
      results -> {:ok, results}
    end
  end
end
