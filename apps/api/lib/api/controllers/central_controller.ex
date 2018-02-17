defmodule Api.CentralController do
  use Api, :controller

  def jsapp(conn, _params) do
    conn
    |> assign(:google_api_key, Application.get_env(:api, :google_api_key))
    |> render("jsapp.html")
  end

  def terms_of_use(conn, _) do
    render(conn, "terms_of_use.html", layout: {Api.LayoutView, "terms_of_use.html"})
  end
end
