defmodule Db.Repo.Migrations.AddSentAtToOrders do
  use Ecto.Migration

  def change do
    alter table("orders") do
      add(:sent_at, :utc_datetime)
    end
  end
end
