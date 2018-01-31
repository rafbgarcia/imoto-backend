defmodule Api.Router do
  use Api, :router

  get "/loaderio-ccfc38fc49ce0360c1f93b82d8ecf647/", Api.Controllers.LoaderController, :challenge
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
