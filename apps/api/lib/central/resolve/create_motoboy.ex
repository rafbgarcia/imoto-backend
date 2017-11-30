defmodule Central.Resolve.CreateMotoboy do
  use Api, :resolver
  alias Core.Motoboy

  def handle(%{params: params}, %{context: %{current_central: central}}) do
    case create_motoboy(params, central.id) do
      {:ok, motoboy} -> {:ok, motoboy}
      {:error, motoboy} -> {:error, Api.ErrorHelper.messages(motoboy)}
    end
  end

  defp create_motoboy(params, central_id) do
    %Motoboy{}
    |> Motoboy.changeset(params)
    |> Motoboy.changeset(%{central_id: central_id, active: true})
    |> Repo.insert
  end
end
