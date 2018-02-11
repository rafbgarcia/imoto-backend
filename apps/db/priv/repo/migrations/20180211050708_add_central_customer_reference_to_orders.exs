defmodule Db.Repo.Migrations.AddCentralCustomerReferenceToOrders do
  use Ecto.Migration

  def change do
    alter table("orders") do
      add :central_customer_id, references(:central_customers)
    end
  end
end
