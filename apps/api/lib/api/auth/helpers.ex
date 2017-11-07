defmodule Api.Auth.Helpers do
  def random_string(size) do
    :crypto.strong_rand_bytes(size) |> Base.url_encode64 |> binary_part(0, size)
  end
end
