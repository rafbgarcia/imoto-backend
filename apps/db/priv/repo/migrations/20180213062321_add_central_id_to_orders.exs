defmodule Db.Repo.Migrations.AddCentralIdToOrders do
  use Ecto.Migration

  def change do
    alter table("orders") do
      add(:central_id, references(:centrals))
    end
  end
end
