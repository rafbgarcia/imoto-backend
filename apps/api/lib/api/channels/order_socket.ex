defmodule Api.Channels.OrderSocket do
  use Phoenix.Socket
  use Absinthe.Phoenix.Socket, schema: Api.GraphqlSchema

  transport :websocket, Phoenix.Transports.WebSocket

  import Ecto.Query
  alias Db.Repo
  alias Core.Motoboy

  def connect(%{"authToken" => auth_token}, socket) do
    motoboy = current_motoboy(auth_token)
    socket = Absinthe.Phoenix.Socket.put_opts(socket, context: %{
      current_motoboy: motoboy
    })
    spawn fn -> push(motoboy.id) end
    {:ok, socket}
  end

  def push(motoboy_id) do
    :timer.sleep(3000)
    Absinthe.Subscription.publish(Api.Endpoint, %Core.Order{id: 1}, [motoboy_orders: motoboy_id])
  end

  defp current_motoboy(auth_token) do
    from(m in Motoboy, where: [auth_token: ^auth_token])
    |> first
    |> Repo.one
  end

  def id(_socket), do: nil
end
