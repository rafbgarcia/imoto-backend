defmodule Api.Controllers.LoaderController do
  use Api, :controller

  def challenge(conn, _) do
    send_resp(conn, 200, "loaderio-8b5de0077a6b032f6f821be422161762")
  end
end
