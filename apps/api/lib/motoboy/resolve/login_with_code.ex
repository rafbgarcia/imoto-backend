defmodule Motoboy.Resolve.LoginWithCode do
  use Api, :resolver
  alias Core.Motoboy

  def handle(%{params: params}, %{context: %{current_motoboy: motoboy}}) do
    with {:ok, motoboy} <- authenticate(params),
    {:ok, jwt, _ } <- Api.Guardian.encode_and_sign(motoboy, %{resource_type: :motoboy}) do
      {:ok, Map.put(motoboy, :token, jwt)}
    end
  end

  defp authenticate(params) do
    motoboy = Repo.get_by(Motoboy, login: String.downcase(params.login))
    case check_password(motoboy, params.password) do
      true -> {:ok, motoboy}
      _ -> {:error, "Login e/ou senha incorretos"}
    end
  end

  defp check_password(nil, _), do: false
  defp check_password(motoboy, given_password) do
    Comeonin.Argon2.checkpw(given_password, motoboy.password_hash)
  end
end
