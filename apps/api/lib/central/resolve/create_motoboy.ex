defmodule Central.Resolve.CreateMotoboy do
  use Api, :resolver
  alias Core.Motoboy

  def handle(%{motoboy_params: motoboy_params}, %{context: %{current_central: central}}) do
    case create_motoboy(motoboy_params, central.id) do
      {:ok, motoboy} -> {:ok, motoboy}
      {:error, motoboy} -> {:error, Api.ErrorHelper.messages(motoboy)}
    end
  end

  defp create_motoboy(params, central_id) do
    %Motoboy{}
    |> Motoboy.changeset(params)
    |> Motoboy.changeset(%{central_id: central_id})
    |> Repo.insert
  end

  defp all_motoboys(central_id) do
    Repo.all(from(m in Motoboy,
      where: m.central_id == ^central_id,
      order_by: m.name,
    ))
  end
end
