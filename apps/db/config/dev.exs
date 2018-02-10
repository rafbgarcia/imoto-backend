use Mix.Config

config :db, Db.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: System.get_env("DATA_DB_USER"),
  password: System.get_env("DATA_DB_PASS"),
  hostname: System.get_env("DATA_DB_HOST"),
  database: "imoto_dev",
  pool_size: 10

config :db, Db.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "rafa",
  password: "",
  database: "imoto_dev",
  hostname: "localhost",
  pool_size: 10
