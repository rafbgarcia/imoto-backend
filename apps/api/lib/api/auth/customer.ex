defmodule Api.Auth.Customer do
  use Api, :graphql_schema

  alias Api.Auth.Helpers
  alias Db.Repo
  alias Core.Customer


  @doc """
  If a customer is not present in the context, we create a new one.
  """
  def current_or_new(_, %{current_customer: current_customer}) do
    {:ok, current_customer}
  end
  def current_or_new(_, _) do
    {:ok, new_customer()}
  end

  defp new_customer do
    Repo.insert!(%Customer{auth_token: Helpers.random_string(64)})
  end
end
