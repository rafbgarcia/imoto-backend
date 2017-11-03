# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :central,
  namespace: Central,
  ecto_repos: [Db.Repo]

# Configures the endpoint
config :central, Central.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "zNT3u/7UrHK44cJXeh/84mNFgGksrrpP7G3sKOQk2klvK7++qiMJb2Z9kUId8A5S",
  render_errors: [view: Central.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Central.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :central, :generators,
  context_app: :central

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
