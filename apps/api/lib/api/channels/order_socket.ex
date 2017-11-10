defmodule Api.Channels.OrderSocket do
  use Phoenix.Socket
  use Absinthe.Phoenix.Socket, schema: Api.GraphqlSchema

  transport :websocket, Phoenix.Transports.WebSocket

  import Ecto.Query
  alias Db.Repo
  alias Core.{Central, Motoboy}

  def connect(%{"centralId" => central_id}, socket) do
    Repo.get(Central, central_id)
    |> case do
      nil ->
        :error
      central ->
        socket = Absinthe.Phoenix.Socket.put_opts(socket, context: %{
          current_central: central
        })
        {:ok, socket}
    end
  end

  def connect(%{"authToken" => auth_token}, socket) do
    from(m in Motoboy, where: [auth_token: ^auth_token])
    |> first |> Repo.one
    |> case do
      nil ->
        :error
      motoboy ->
        socket = Absinthe.Phoenix.Socket.put_opts(socket, context: %{
          current_motoboy: motoboy
        })
        {:ok, socket}
    end
  end

  def id(_socket), do: nil
end
