defmodule Core do
  def schema do
    quote do
      use Ecto.Schema
      @timestamps_opts [
        type: Timex.Ecto.TimestampWithTimezone,
        autogenerate: {Timex.Ecto.TimestampWithTimezone, :autogenerate}
      ]

      import Ecto.Changeset
    end
  end

  @doc """
  When used, dispatch to the appropriate controller/view/etc.
  """
  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
