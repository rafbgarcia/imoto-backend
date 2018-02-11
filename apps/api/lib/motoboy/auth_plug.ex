defmodule Motoboy.AuthPlug do
  @behaviour Plug
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _) do
    get_token(conn)
    |> current_resource
    |> case do
      nil -> conn
      resource -> put_private(conn, :absinthe, %{context: %{current_motoboy: resource}})
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
