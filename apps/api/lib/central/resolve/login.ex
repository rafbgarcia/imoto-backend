defmodule Central.Resolve.Login do
  use Api, :resolver
  alias Core.Central

  def handle(%{email: email, password: password}, _ctx) do
    with {:ok, central} <- authenticate(email, password),
         {:ok, jwt, _} <- Api.Guardian.encode_and_sign(central, %{resource_type: :central}) do
      {:ok, Map.put(central, :token, jwt)}
    end
  end

  defp authenticate(email, password) do
    central = Repo.get_by(Central, email: String.downcase(email))

    case check_password(central, password) do
      true -> {:ok, central}
      _ -> {:error, "Login e/ou senha incorretos"}
    end
  end

  defp check_password(nil, _), do: false

  defp check_password(central, given_password) do
    Comeonin.Argon2.checkpw(given_password, central.password_hash)
  end
end
