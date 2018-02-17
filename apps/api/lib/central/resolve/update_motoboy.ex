defmodule Central.Resolve.UpdateMotoboy do
  use Api, :resolver
  alias Core.Motoboy

  def handle(%{id: motoboy_id, params: params}, %{context: %{current_central: central}}) do
    central
    |> get_motoboy(motoboy_id)
    |> update_with(params)
    |> case do
      {:ok, motoboy} -> {:ok, motoboy}
      {:error, motoboy} -> {:error, Api.ErrorHelper.messages(motoboy)}
    end
  end

  defp update_with(motoboy, %{state: state} = params) when state in ["available", "unavailable"] do
    motoboy
    |> Motoboy.changeset(params)
    |> Repo.update()
  end

  defp get_motoboy(%Core.Central{} = central, motoboy_id) do
    Motoboy
    |> Repo.get_by(id: motoboy_id, central_id: central.id)
  end
end
