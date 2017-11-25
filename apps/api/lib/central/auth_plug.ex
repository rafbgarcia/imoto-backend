defmodule Central.AuthPlug do
  @behaviour Plug
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _) do
    case Api.Guardian.Plug.current_resource(conn) do
      nil -> conn
      central -> put_private(conn, :absinthe, %{context: %{current_central: central}})
    end
  end
end
