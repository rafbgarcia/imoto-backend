defmodule Central.Resolve.Login do
  use Api, :resolver
  alias Core.Central

  def handle(params, _ctx) do
    with {:ok, central} <- authenticate(params),
    {:ok, jwt, _ } <- Api.Guardian.encode_and_sign(central, %{resource_type: :central}) do
      {:ok, Map.put(central, :token, jwt)}
    end
  end

  defp authenticate(params) do
    central = Repo.get_by(Central, login: String.downcase(params.login))
    case check_password(central, params.password) do
      true -> {:ok, central}
      _ -> {:error, "Login e/ou senha incorretos"}
    end
  end

  defp check_password(nil, _), do: false
  defp check_password(central, given_password) do
    Comeonin.Argon2.checkpw(given_password, central.password_hash)
  end
end
