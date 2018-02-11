defmodule Company.Resolve.Login do
  use Api, :resolver
  alias Core.Company

  def handle(params, _ctx) do
    with {:ok, company} <- authenticate(params),
         {:ok, jwt, _} <- Api.Guardian.encode_and_sign(company, %{resource_type: :company}) do
      {:ok, Map.put(company, :token, jwt)}
    end
  end

  defp authenticate(params) do
    company = Repo.get_by(Company, email: String.downcase(params.email))

    case check_password(company, params.password) do
      true -> {:ok, company}
      _ -> {:error, "Email e/ou senha incorretos"}
    end
  end

  defp check_password(nil, _), do: false

  defp check_password(company, given_password) do
    Comeonin.Argon2.checkpw(given_password, company.password_hash)
  end
end
