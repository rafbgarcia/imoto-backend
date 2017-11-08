defmodule Api.Channels.OrderSocket do
  use Phoenix.Socket
  use Absinthe.Phoenix.Socket, schema: Api.GraphqlSchema

  transport :websocket, Phoenix.Transports.WebSocket

  import Ecto.Query
  alias Db.Repo
  alias Core.Motoboy

  def connect(params, socket) do
    # socket = Absinthe.Phoenix.Socket.put_opts(socket, context: %{
    #   current_motoboy: current_motoboy(params)
    # })
    spawn &push/0
    {:ok, socket}
  end

  def push do
    :timer.sleep(10000)
    Absinthe.Subscription.publish(Api.Endpoint, %Core.Order{id: 1}, [motoboy_orders: "my-auth-token"])
    spawn &push/0
  end

  # defp current_motoboy(%{"auth_token" => auth_token}) do
  #   from(m in Motoboy, where: [auth_token: ^auth_token])
  #   |> first
  #   |> Repo.one
  # end

  def id(_socket), do: nil
end
