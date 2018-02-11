defmodule Db.Repo.Migrations.CreateCentralCustomers do
  use Ecto.Migration

  def change do
    create table(:central_customers) do
      add :central_id, references(:centrals)
      add :name, :string
      add :phone_number, :string

      add :street, :string
      add :number, :string
      add :neighborhood, :string
      add :zipcode, :string
      add :complement, :string
      add :reference, :string
      add :city, :string
      add :uf, :string
      add :lat, :decimal
      add :lng, :decimal
      timestamps()
    end
  end
end
