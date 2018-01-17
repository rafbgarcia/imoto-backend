defmodule Central.Resolve.Register do
  use Api, :resolver
  alias Core.Central

  def handle(%{params: params}, _ctx) do
    with {:ok, central} <- create_central(params),
    {:ok, jwt, _ } <- Api.Guardian.encode_and_sign(central, %{resource_type: :central}) do
      {:ok, Map.put(central, :token, jwt)}
    end
  end

  defp create_central(params) do
    %Central{}
    |> Central.changeset(add_needed_params(params))
    |> Repo.insert
  end

  defp add_needed_params(params) do
    params
    |> Map.put(:active, false)
    |> Map.put(:password_hash, hashed_pw(params[:password]))
  end

  defp hashed_pw(password) do
    %{password_hash: password_hash} = Comeonin.Argon2.add_hash(password)
    password_hash
  end
end
