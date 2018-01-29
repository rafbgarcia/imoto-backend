defmodule Central.Resolve.MotoboyHistory do
  use Api, :resolver
  alias Core.History

  def handle(%{motoboy_id: motoboy_id}, %{context: %{current_central: nil}}), do: {:error, "Faça login primeiro"}
  def handle(%{motoboy_id: motoboy_id}, _) do
    {:ok, get_history(motoboy_id)}
  end

  defp get_history(motoboy_id) do
    from(h in History,
      where: h.motoboy_id == ^motoboy_id,
      where: h.scope == ^"motoboy",
      where: h.inserted_at >= ^Timex.beginning_of_day(Timex.local),
      where: h.inserted_at <= ^Timex.end_of_day(Timex.local),
      order_by: [asc: :inserted_at],
    )
    |> Repo.all
  end
end
