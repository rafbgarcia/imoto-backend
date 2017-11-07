defmodule Api.Router do
  use Api, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api" do
    pipe_through :api
    post "/graphql", Absinthe.Plug, schema: Api.GraphqlSchema
  end
end
