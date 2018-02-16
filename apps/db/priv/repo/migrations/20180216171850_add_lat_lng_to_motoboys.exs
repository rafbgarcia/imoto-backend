defmodule Db.Repo.Migrations.AddLatLngToMotoboys do
  use Ecto.Migration

  def change do
    alter table("motoboys") do
      add(:lat, :string)
      add(:lng, :string)
    end
  end
end
