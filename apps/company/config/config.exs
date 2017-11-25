# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :company,
  namespace: Company,
  ecto_repos: [Company.Repo]

# Configures the endpoint
config :company, Company.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Y+OjsmR0LHXXlJiYQg7GpJ+WDjcIBh/SeCOLaJnDzDdESWJYx5byw6TfKwKGmI5r",
  render_errors: [view: Company.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Company.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :company, :generators,
  context_app: false

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
