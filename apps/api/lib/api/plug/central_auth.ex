defmodule Api.Plug.CentralAuth do
  @behaviour Plug

  import Plug.Conn
  import Ecto.Query

  alias Db.Repo
  alias Core.Central

  def init(opts), do: opts

  def call(conn, _) do
    case build_context(conn) do
      {:ok, context} ->
        put_private(conn, :absinthe, %{context: context})
      _ ->
        conn
        |> send_resp(400, "Bad Request")
        |> halt()
    end
  end

  @doc """
  Return the current central context based on the authorization header
  """
  def build_context(conn) do
    with [token] <- get_req_header(conn, "authorization"),
    {:ok, central} <- authorize(token) do
      {:ok, %{current_central: central}}
    else
      [] -> {:error}
    end
  end

  defp authorize(token) do
    Central
    |> where(auth_token: ^token)
    |> first
    |> Repo.one
    |> case do
      nil -> {:error}
      central -> {:ok, central}
    end
  end
end
