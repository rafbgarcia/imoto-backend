defmodule Central.Router do
  use Central, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  scope "/" do
    pipe_through :browser

    get "/termos-de-uso", Central.CentralController, :terms_of_use
    get "/*path", Central.CentralController, :jsapp
  end
end
