use Mix.Config

# Configure your database
config :db, Db.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "rafa",
  password: "",
  database: "imoto_dev",
  hostname: "localhost",
  pool_size: 10
