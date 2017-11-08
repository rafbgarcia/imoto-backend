defmodule Api.Endpoint do
  use Phoenix.Endpoint, otp_app: :api
  use Absinthe.Phoenix.Endpoint

  socket "/socket", Api.Channels.OrderSocket

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phoenix.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/", from: :api, gzip: false,
    only: ~w(css fonts images js favicon.ico robots.txt)

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  plug Plug.Session,
    store: :cookie,
    key: "_api_key",
    signing_salt: "nxQi/gen"

  plug CORSPlug, headers: ["Authorization", "Content-Type", "Accept", "Origin",
            "User-Agent", "DNT","Cache-Control", "X-Mx-ReqToken",
            "Keep-Alive", "X-Requested-With", "If-Modified-Since",
            "X-CSRF-Token", "X-XSRF-TOKEN"]

  plug Api.Router

  @doc """
  Callback invoked for dynamically configuring the endpoint.

  It receives the endpoint configuration and checks if
  configuration should be loaded from the system environment.
  """
  def init(_key, config) do
    {:ok, Keyword.put(config, :http, [:inet6, port: 4001])}
  end
end
