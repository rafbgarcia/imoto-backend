defmodule Db.Repo.Migrations.AddAddressToCentralCustomersAndStops do
  use Ecto.Migration

  def change do
    alter table("central_customers") do
      add(:address, :string)
      add(:google_place_id, :string)
    end

    alter table("stops") do
      add(:address, :string)
      add(:google_place_id, :string)
    end
  end
end
