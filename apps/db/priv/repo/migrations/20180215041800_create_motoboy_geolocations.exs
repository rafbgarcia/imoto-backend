defmodule Db.Repo.Migrations.CreateMotoboyGeolocations do
  use Ecto.Migration

  def change do
    create table("motoboy_geolocations") do
      add(:motoboy_id, references(:motoboys))
      add(:lat, :string)
      add(:lng, :string)

      timestamps()
    end
  end
end
