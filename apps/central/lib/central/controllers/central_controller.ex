defmodule Central.CentralController do
  use Central, :controller

  def jsapp(conn, _params) do
    render conn, "jsapp.html"
  end

  def terms_of_use(conn, _) do
    render conn, "terms_of_use.html", layout: {Central.LayoutView, "terms_of_use.html"}
  end
end
