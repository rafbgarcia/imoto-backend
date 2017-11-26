defmodule Company.Resolve.Logout do
  def logout(%{token: token}, _) do
    Api.Guardian.revoke(token)
    {:ok, %{token: nil}}
  end
end
