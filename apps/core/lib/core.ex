defmodule Core do
  def schema do
    quote do
      use Ecto.Schema

      @timestamps_opts [
        type: Timex.Ecto.DateTime,
        autogenerate: {Timex.Ecto.DateTime, :autogenerate, []}
      ]

      import Ecto.Changeset
      import Ecto.Query
    end
  end

  @doc """
  When used, dispatch to the appropriate controller/view/etc.
  """
  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
