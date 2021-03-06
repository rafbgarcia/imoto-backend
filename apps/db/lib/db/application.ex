defmodule Db.Application do
  @moduledoc """
  The Db Application Service.

  The db system business domain lives in this application.

  Exposes API to clients such as the `DbWeb` application
  for use in channels, controllers, and elsewhere.
  """
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    Supervisor.start_link(
      [
        supervisor(Db.Repo, [])
      ],
      strategy: :one_for_one,
      name: Db.Supervisor
    )
  end
end
