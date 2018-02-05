defmodule Api.Router do
  use Api, :router

  get "/", Redirect, to: "/central"

  get "/loaderio-8b5de0077a6b032f6f821be422161762/", Api.Controllers.LoaderController, :challenge
  get "/termos-de-uso", Api.CentralController, :terms_of_use

  pipeline :motoboy_api do
    plug :accepts, ["json"]
    plug Motoboy.AuthPlug
  end
  scope "/motoboy" do
    pipe_through :motoboy_api
    post "/", Absinthe.Plug, schema: Motoboy.GraphqlSchema
  end

  pipeline :central_api do
    plug :accepts, ["json"]
    plug Central.AuthPlug
  end
  scope "/central" do
    pipe_through :central_api
    get "/*path", Api.CentralController, :jsapp
    post "/", Absinthe.Plug.GraphiQL, schema: Central.GraphqlSchema
  end

  pipeline :company_api do
    plug :accepts, ["json"]
    plug Company.AuthPlug
  end
  scope "/company" do
    pipe_through :company_api
    post "/", Absinthe.Plug.GraphiQL, schema: Company.GraphqlSchema
  end
end

defmodule Redirect do
  def init(opts), do: opts

  def call(conn, opts) do
    conn
    |> Phoenix.Controller.redirect(opts)
    |> Plug.Conn.halt()
  end
end
