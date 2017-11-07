defmodule Api.Plug.CustomerAuth do
  @behaviour Plug

  import Plug.Conn
  import Ecto.Query

  alias Db.Repo
  alias Core.Customer

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
  Return the current customer context based on the authorization header
  """
  def build_context(conn) do
    with [token] <- get_req_header(conn, "authorization"),
    {:ok, customer} <- authorize(token) do
      {:ok, %{current_customer: customer}}
    else
      [] -> {:ok, %{current_customer: nil}}
    end
  end

  defp authorize(token) do
    Customer
    |> where(auth_token: ^token)
    |> first
    |> Repo.one
    |> case do
      nil -> {:ok, nil}
      customer -> {:ok, customer}
    end
  end
end
