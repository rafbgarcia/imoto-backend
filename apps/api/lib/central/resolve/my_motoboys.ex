defmodule Central.Resolve.MyMotoboys do
  use Api, :resolver

  alias Core.{Motoboy}

  def handle(_args, %{context: %{current_central: current_central}}) do
    {:ok, all(current_central.id)}
  end

  defp all(central_id) do
    from(m in Motoboy,
      where: m.central_id == ^central_id,
      order_by: fragment(
        """
        CASE m0.state WHEN ? THEN 1 WHEN ? THEN 2 ELSE 3 END,
        m0.became_available_at ASC,
        m0.became_busy_at ASC,
        m0.became_unavailable_at ASC
        """,
        ^Motoboy.available(), ^Motoboy.busy()
      )
    )
    |> Repo.all
  end
end
