defmodule Api.Auth.Motoboy do use Api, :graphql_schema
  use Api, :graphql_schema

  alias Api.Auth.Helpers
  alias Db.Repo
  alias Core.Motoboy


  @doc """
  If a customer is not present in the context, we create a new one.
  """
  def current_or_new(_, %{current_motoboy: current_motoboy} = _ctx) do
    {:ok, current_motoboy}
  end
  def current_or_new(_, _) do
    {:ok, new_motoboy()}
  end

  defp new_motoboy do
    Repo.insert!(%Motoboy{auth_token: Helpers.random_string(64)})
  end
end
