# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :central,
  namespace: Central,
  ecto_repos: [Central.Repo]

# Configures the endpoint
config :central, Central.Endpoint,
  http: [port: 4002],
  url: [host: "localhost", port: 4002],
  secret_key_base: "GQFhV0/lD+y9UczhPe3Yt0I0DB8XeFNgffhVqWvtzwqQj7l3DyRvCej4JlAIQ7eL",
  render_errors: [view: Central.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Central.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :central, :generators,
  context_app: false

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
