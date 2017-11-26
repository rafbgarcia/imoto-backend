defmodule Company.Resolve.Login do
  alias Core.Company
  alias Db.Repo

  def login(params, _ctx) do
    with {:ok, company} <- authenticate(params),
    {:ok, jwt, _ } <- Api.Guardian.encode_and_sign(company, %{resource_type: :company}) do
      {:ok, Map.put(company, :token, jwt)}
    end
  end

  defp authenticate(params) do
    company = Repo.get_by(Company, login: String.downcase(params.login))
    case check_password(company, params.password) do
      true -> {:ok, company}
      _ -> {:error, "Login e/ou senha incorretos"}
    end
  end

  defp check_password(nil, _), do: false
  defp check_password(company, given_password) do
    Comeonin.Argon2.checkpw(given_password, company.password_hash)
  end
end
