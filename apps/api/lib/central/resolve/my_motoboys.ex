defmodule Central.Resolve.MyMotoboys do
  use Api, :resolver

  alias Core.{Motoboy}

  def handle(%{only_active: only_active}, %{context: %{current_central: central}}) do
    {:ok, central |> motoboys(only_active)}
  end

  defp motoboys(%Core.Central{} = central, false) do
    central
    |> motoboys_query
    |> Repo.all()
  end

  defp motoboys(%Core.Central{} = central, true) do
    central
    |> motoboys_query
    |> where(active: ^true)
    |> Repo.all()
  end

  defp motoboys_query(central) do
    from(
      m in Motoboy,
      where: m.central_id == ^central.id,
      order_by:
        fragment(
          """
          CASE m0.state WHEN ? THEN 1 WHEN ? THEN 2 ELSE 3 END,
          m0.became_available_at ASC,
          m0.became_busy_at ASC,
          m0.became_unavailable_at ASC
          """,
          ^Motoboy.available(),
          ^Motoboy.busy()
        )
    )
  end
end
