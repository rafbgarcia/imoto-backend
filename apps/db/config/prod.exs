use Mix.Config

config :db, Db.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: System.get_env("DATA_DB_USER"),
  password: System.get_env("DATA_DB_PASS"),
  hostname: System.get_env("DATA_DB_HOST"),
  database: "imoto",
  pool_size: 10

# config :db, Db.Repo,
#   adapter: Ecto.Adapters.Postgres,
#   url: "${DATABASE_URL}",
#   database: "",
#   ssl: true,
#   pool_size: 1 # TODO change this when move to standard plan
