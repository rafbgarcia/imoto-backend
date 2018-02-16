defmodule Motoboy.AuthPlug do
  @behaviour Plug
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _) do
    case get_token(conn) do
      token when token in [nil, "", []] -> conn
      token -> current_resource_or_error(conn, token)
    end
  end

  defp current_resource_or_error(conn, token) do
    token
    |> current_resource
    |> case do
      nil ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(403, "Seu token expirou, por favor refaça login")
        |> halt

      resource ->
        put_private(conn, :absinthe, %{context: %{current_motoboy: resource}})
    end
  end

  defp current_resource([]), do: nil

  defp current_resource(token) do
    case Api.Guardian.resource_from_token(token) do
      {:ok, resource, _} -> resource
      {:error, _} -> nil
    end
  end

  defp get_token(conn) do
    with ["Bearer " <> token] <- conn |> get_req_header("authorization") do
      token
    end
  end
end
