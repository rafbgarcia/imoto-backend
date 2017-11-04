defmodule Api.Router do
  use Api, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/" do
    pipe_through :api
    get "/graphql", Absinthe.Plug, schema: Api.GraphqlSchema
  end
end
