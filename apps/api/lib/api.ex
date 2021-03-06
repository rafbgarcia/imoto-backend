defmodule Api do
  @moduledoc """
  The entrypoint for defining your web interface, such
  as controllers, views, channels and so on.

  This can be used in your application as:

      use Api, :controller
      use Api, :view

  The definitions below will be executed for every view,
  controller, etc, so keep them short and clean, focused
  on imports, uses and aliases.

  Do NOT define functions inside the quoted expressions
  below. Instead, define any helper function in modules
  and import those modules here.
  """

  def graphql_schema do
    quote do
      use Absinthe.Schema.Notation
      use Absinthe.Ecto, repo: Db.Repo
    end
  end

  def resolver do
    quote do
      alias Db.Repo
      import Ecto.Query
      import Ecto
    end
  end

  # @deprecated Use :resolver
  def context do
    quote do
      alias Db.Repo
      import Ecto.Query
      import Ecto
    end
  end

  def testcase do
    quote do
      import Ecto
      import Ecto.Query
      alias Db.Repo

      alias Core.{
        Order,
        Central,
        Motoboy,
        Customer,
        Location,
        Stop,
        History,
        Company,
        CentralCustomer,
        MotoboyGeolocation,
        OrderCancelation
      }
    end
  end

  def iex do
    quote do
      import Ecto
      import Ecto.Query
      alias Db.Repo

      alias Core.{
        Order,
        Central,
        Motoboy,
        Customer,
        Location,
        Stop,
        History,
        Company,
        CentralCustomer,
        MotoboyGeolocation,
        OrderCancelation
      }
    end
  end

  def controller do
    quote do
      use Phoenix.Controller, namespace: Api
      import Plug.Conn
      import Api.Router.Helpers
      import Api.Gettext
    end
  end

  def view do
    quote do
      use Phoenix.View,
        root: "lib/api/templates",
        namespace: Api

      # Import convenience functions from controllers
      import Phoenix.Controller, only: [get_flash: 2, view_module: 1]

      import Api.Router.Helpers
      import Api.ErrorHelpers
      import Api.Gettext
    end
  end

  def router do
    quote do
      use Phoenix.Router
      import Plug.Conn
      import Phoenix.Controller
    end
  end

  def channel do
    quote do
      use Phoenix.Channel
      import Api.Gettext
    end
  end

  @doc """
  When used, dispatch to the appropriate controller/view/etc.
  """
  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
