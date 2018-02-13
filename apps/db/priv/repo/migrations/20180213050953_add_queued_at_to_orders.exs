defmodule Db.Repo.Migrations.AddQueuedAtToOrders do
  use Ecto.Migration

  def change do
    alter table("orders") do
      remove(:canceled_at)
      add(:queued_at, :utc_datetime)
    end
  end
end
