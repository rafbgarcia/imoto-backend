defmodule Central.CentralController do
  use Central, :controller

  def orders(conn, _params) do
    render conn, "orders.html"
  end

  def index(conn, _params) do
    render conn, "index.html"
  end
end
