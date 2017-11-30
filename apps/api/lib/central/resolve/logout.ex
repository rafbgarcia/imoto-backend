defmodule Central.Resolve.Logout do
  def handle(%{token: token}, _) do
    Api.Guardian.revoke(token)
    {:ok, %{token: nil}}
  end
end
