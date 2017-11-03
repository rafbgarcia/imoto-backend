defmodule Db.Repo.Migrations.CreateCentrals do
  use Ecto.Migration

  def change do
    create table(:centrals) do
      add :name, :string
      add :email, :string
      add :password, :string
      add :available, :boolean, default: false, null: false
      add :phone_number, :string

      timestamps()
    end
  end
end
