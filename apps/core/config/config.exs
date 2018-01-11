# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :core,
  namespace: Core,
  ecto_repos: [Db.Repo]

# Configures the endpoint
config :core, Core.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "4x7AyBul/Tc7RG7h4+07k68pMD1znIV/+Ph8xDiyiLVKHzOGQvvkcIUlAItvQzKc",
  render_errors: [view: Core.ErrorView, accepts: ~w(json)],
  pubsub: [name: Core.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :core, :generators,
  context_app: false

config :money,
  default_currency: :BRL,
  separator: ".",
  delimeter: ",",
  symbol: true,
  symbol_on_right: false,
  symbol_space: true

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
