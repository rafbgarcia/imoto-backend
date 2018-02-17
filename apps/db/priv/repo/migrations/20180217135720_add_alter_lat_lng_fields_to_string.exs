defmodule Db.Repo.Migrations.AddAlterLatLngFieldsToString do
  use Ecto.Migration

  def change do
    alter table("stops") do
      modify :lat, :string
      modify :lng, :string
    end

    alter table("central_customers") do
      modify :lat, :string
      modify :lng, :string
    end
  end
end
