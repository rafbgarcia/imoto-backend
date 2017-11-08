defmodule Api.OrderSocket do
  use Phoenix.Socket
  use Absinthe.Phoenix.Socket, schema: Api.GraphqlSchema

  transport :websocket, Phoenix.Transports.WebSocket

  def connect(_params, socket) do
    # current_motoboy = current_motoboy(params)
    # socket = Absinthe.Phoenix.Socket.put_opts(socket, context: %{
    #   current_motoboy: current_motoboy
    # })
    {:ok, socket}
  end

  # defp current_motoboy(%{"motoboy_id" => id}) do
  #   Db.Repo.get(Core.Motoboy, id)
  # end

  def id(_socket), do: nil
end
