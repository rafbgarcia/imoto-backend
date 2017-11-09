defmodule Api.Channels.OrderSocket do
  use Phoenix.Socket
  use Absinthe.Phoenix.Socket, schema: Api.GraphqlSchema

  transport :websocket, Phoenix.Transports.WebSocket

  import Ecto.Query
  alias Db.Repo
  alias Core.Motoboy

  def connect(%{"authToken" => auth_token}, socket) do
    case current_motoboy(auth_token) do
      nil ->
        :error
      motoboy ->
        socket = Absinthe.Phoenix.Socket.put_opts(socket, context: %{
          current_motoboy: motoboy
        })
        {:ok, socket}
    end
  end

  defp current_motoboy(auth_token) do
    from(m in Motoboy, where: [auth_token: ^auth_token])
    |> first
    |> Repo.one
  end

  def id(_socket), do: nil
end
