# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :api,
  namespace: Api,
  ecto_repos: [Api.Repo]

# Configures the endpoint
config :api, Api.Endpoint,
  http: [port: 4001],
  url: [host: "localhost", port: 4001],
  secret_key_base: "/oA9uwTAyIVn99X5VKrReqdAuZzM5XfVCSGjdVo8mU02SJ16i2Ihx4IDxk5IS2VC",
  render_errors: [view: Api.ErrorView, accepts: ~w(json)],
  pubsub: [name: Api.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :api, :generators,
  context_app: false

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
