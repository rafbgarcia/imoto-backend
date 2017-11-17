defmodule Api.Router do
  use Api, :router

  pipeline :customer_api do
    plug :accepts, ["json"]
    plug Api.Plug.CustomerAuth
  end

  pipeline :motoboy_api do
    plug :accepts, ["json"]
    plug Api.Plug.MotoboyAuth
  end

  pipeline :central_api do
    plug :accepts, ["json"]
    plug Api.Plug.CentralAuth
  end

  get "/loaderio-ccfc38fc49ce0360c1f93b82d8ecf647/", Api.Controllers.LoaderController, :challenge

  scope "/api/customer" do
    pipe_through :customer_api
    post "/graphql", Absinthe.Plug.GraphiQL,
      schema: Api.GraphqlSchema,
      socket: Api.Channels.OrderSocket,
      interface: :simple
  end

  scope "/api/motoboy" do
    pipe_through :motoboy_api
    forward "/graphql", Absinthe.Plug,
      schema: Api.GraphqlSchema,
      socket: Api.Channels.OrderSocket,
      interface: :simple
  end

  scope "/api/central" do
    pipe_through :central_api
    post "/graphql", Absinthe.Plug.GraphiQL,
      schema: Api.GraphqlSchema,
      socket: Api.Channels.OrderSocket,
      interface: :simple
  end
end
