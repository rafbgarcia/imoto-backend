defmodule Api.ErrorHelper do
  def messages(changeset) do
    changeset.errors
    |> Enum.map(fn {key, {message, _}} ->
      "#{Phoenix.Naming.humanize(key)} #{message}"
    end)
  end
end
