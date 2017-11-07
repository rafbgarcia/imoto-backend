defmodule Api.Auth.Customer do
  use Api, :graphql_schema

  alias Db.Repo
  alias Core.Customer


  @doc """
  If a customer is not present in the context, we create a new one.
  """
  def current_or_new(_, %{current_user: current_user} = _ctx) do
    {:ok, current_user}
  end
  def current_or_new(_, _) do
    {:ok, new_customer()}
  end

  defp new_customer do
    Repo.insert!(%Customer{auth_token: random_string(64)})
  end

  defp random_string(size) do
    :crypto.strong_rand_bytes(size) |> Base.url_encode64 |> binary_part(0, size)
  end
end
