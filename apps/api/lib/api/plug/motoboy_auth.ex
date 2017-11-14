defmodule Api.Plug.MotoboyAuth do
  @behaviour Plug

  import Plug.Conn
  import Ecto.Query

  alias Db.Repo
  alias Core.Motoboy

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
  Return the current motoboy context based on the authorization header
  """
  def build_context(conn) do
    with [token] <- get_req_header(conn, "authorization"),
    {:ok, motoboy} <- authorize(token) do
      {:ok, %{current_motoboy: motoboy}}
    else
      [] -> {:error}
    end
  end

  defp authorize(token) do
    Motoboy
    |> where(auth_token: ^token)
    |> first
    |> Repo.one
    |> case do
      nil -> {:ok, nil}
      motoboy -> {:ok, motoboy}
    end
  end
end
