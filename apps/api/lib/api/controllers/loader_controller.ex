defmodule Api.Controllers.LoaderController do
  use Api, :controller

  def challenge(conn, _) do
    send_resp(conn, 200, "loaderio-ccfc38fc49ce0360c1f93b82d8ecf647")
  end

end
