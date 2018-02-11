defmodule Db.Repo.Migrations.AddLocationFieldsToStop do
  use Ecto.Migration

  def change do
    alter table("stops") do
      remove(:location_id)

      add(:street, :string)
      add(:number, :string)
      add(:neighborhood, :string)
      add(:zipcode, :string)
      add(:complement, :string)
      add(:reference, :string)
      add(:city, :string)
      add(:uf, :string)
      add(:lat, :decimal)
      add(:lng, :decimal)
    end
  end
end
