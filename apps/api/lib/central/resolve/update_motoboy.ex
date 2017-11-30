defmodule Central.Resolve.UpdateMotoboy do
  use Api, :resolver
  alias Core.Motoboy

  def handle(%{id: id, params: params}, %{context: %{current_central: central}}) do
    case update_motoboy(id, params, central.id) do
      {:ok, motoboy} -> {:ok, motoboy}
      {:error, motoboy} -> {:error, Api.ErrorHelper.messages(motoboy)}
    end
  end

  defp update_motoboy(id, params, central_id) do
    get_motoboy(id, central_id)
    |> Motoboy.changeset(params)
    |> Repo.update
  end

  defp get_motoboy(motoboy_id, central_id) do
    from(m in Motoboy,
      where: m.id == ^motoboy_id,
      where: m.central_id == ^central_id,
    )
    |> first
    |> Repo.one
  end
end
