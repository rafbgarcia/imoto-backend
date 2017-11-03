defmodule Core.Application do
  use Application

  def start(_, _) do
    opts = [strategy: :one_for_one, name: Core.Supervisor]
    Supervisor.start_link([], opts)
  end
end
