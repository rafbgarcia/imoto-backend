use Mix.Config

# Configure your database
config :db, Db.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "rafa",
  password: "",
  database: "my_app_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
