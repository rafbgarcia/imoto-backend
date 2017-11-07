defmodule Api.Router do
  use Api, :router

  pipeline :customer_api do
    plug :accepts, ["json"]
    plug Api.Plug.CustomerAuth
  end
  scope "/api/customer" do
    pipe_through :customer_api

    post "/graphql", Absinthe.Plug, schema: Api.GraphqlSchema
  end

  pipeline :central_api do
    plug :accepts, ["json"]
  end
  scope "/api/central" do
    pipe_through :central_api

    post "/graphql", Absinthe.Plug, schema: Api.GraphqlSchema
  end

  pipeline :motoboy_api do
    plug :accepts, ["json"]
    plug Api.Plug.MotoboyAuth
  end
  scope "/api/motoboy" do
    pipe_through :motoboy_api

    post "/graphql", Absinthe.Plug, schema: Api.GraphqlSchema
  end
end
