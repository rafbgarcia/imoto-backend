defmodule Db.Repo.Migrations.ReaddCanceledAtToOrders do
  use Ecto.Migration

  def change do
    alter table("orders") do
      add(:canceled_at, :utc_datetime)
    end
  end
end
