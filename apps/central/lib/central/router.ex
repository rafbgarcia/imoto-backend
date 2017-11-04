defmodule Central.Router do
  use Central, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/extranet", Central do
    pipe_through :browser # Use the default browser stack

    get "/", CentralController, :orders
    resources "/central", CentralController
  end

  forward "/api", Api.Router
end
