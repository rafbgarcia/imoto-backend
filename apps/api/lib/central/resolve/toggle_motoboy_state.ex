defmodule Central.Resolve.ToggleMotoboyState do
  use Api, :resolver
  alias Core.Motoboy

  @doc """
  Toggle motoboy's state: available <=> unavailable
  """
  def handle(%{id: motoboy_id}, %{context: %{current_central: central}}) do
    central
    |> get_motoboy(motoboy_id)
    |> toggle_state
    |> case do
      {:ok, motoboy} -> {:ok, motoboy}
      {:error, motoboy} -> {:error, Api.ErrorHelper.messages(motoboy)}
    end
  end

  defp toggle_state(nil) do
    {:error, "Este motoboy não existe. Caso isso seja um erro, entre em contato conosco."}
  end

  defp toggle_state(%{state: "available"} = motoboy) do
    motoboy
    |> update_motoboy(%{state: Motoboy.unavailable(), became_unavailable_at: Timex.local()})
  end

  defp toggle_state(%{state: "unavailable"} = motoboy) do
    motoboy
    |> update_motoboy(%{state: Motoboy.available(), became_available_at: Timex.local()})
  end

  defp update_motoboy(motoboy, params) do
    motoboy
    |> Motoboy.changeset(params)
    |> Repo.update()
  end

  defp get_motoboy(%Core.Central{} = central, motoboy_id) do
    Motoboy
    |> Repo.get_by(id: motoboy_id, central_id: central.id)
  end
end
