defmodule Central.Resolve.Register do
  use Api, :resolver
  alias Core.Central

  def handle(%{params: params}, _ctx) do
    with {:ok, central} <- create_central(params),
         {:ok, jwt, _} <- Api.Guardian.encode_and_sign(central, %{resource_type: :central}) do
      {:ok, Map.put(central, :token, jwt)}
    else
      {:error, changeset} -> {:error, Api.ErrorHelper.messages(changeset)}
    end
  end

  defp create_central(params) do
    %Central{}
    |> Central.changeset(parse(params))
    |> Repo.insert()
  end

  defp parse(params) do
    # TODO:
    # `active` should be false here in the future for us to validate the Central's CNPJ

    params
    |> Map.replace(:email, String.downcase(params.email))
    |> Map.put(:active, true)
    |> Map.put(:password_hash, hashed_pw(params[:password]))
  end

  defp hashed_pw(password) do
    %{password_hash: password_hash} = Comeonin.Argon2.add_hash(password)
    password_hash
  end
end
