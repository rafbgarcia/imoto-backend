defmodule Db do
  def model do
    quote do
      use Ecto.Schema
      @timestamps_opts [
        type: Timex.Ecto.TimestampWithTimezone,
        autogenerate: {Timex.Ecto.TimestampWithTimezone, :autogenerate}
      ]

      import Ecto.Changeset
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end

  @moduledoc """
  Db keeps the contexts that define your domain
  and business logic.

  Contexts are also responsible for managing your data, regardless
  if it comes from the database, an external API or others.
  """
end
