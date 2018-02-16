defmodule Db.Repo.Migrations.CreateOrderCancelations do
  use Ecto.Migration

  def change do
    create table("order_cancelations") do
      add(:order_id, references(:orders))
      add(:motoboy_id, references(:motoboys))
      add(:reason, :string)
      add(:has_order_in_hands, :boolean)
      add(:lat, :string)
      add(:lng, :string)
      timestamps()
    end
  end
end
