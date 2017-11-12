defmodule Db.Repo.Migrations.CreateCentrals do
  use Ecto.Migration

  def change do
    ##################
    ### Centrals
    ##################

    create table(:centrals) do
      add :name, :string
      add :auth_token, :string
      add :login, :string
      add :password, :string
      add :available, :boolean, default: false, null: false
      add :became_available_at, :utc_datetime
      add :became_unavailable_at, :utc_datetime
      add :last_order_taken_at, :utc_datetime
      add :phone_number, :string
      timestamps()
    end

    create table(:motoboys) do
      add :name, :string
      add :central_id, references(:centrals)
      add :state, :string, default: "unavailable"
      add :phone_number, :string
      add :login, :string
      add :password, :string
      add :auth_token, :string
      add :became_unavailable_at, :utc_datetime
      add :became_available_at, :utc_datetime
      add :became_busy_at, :utc_datetime
      timestamps()
    end


    ##################
    ### Customers
    ##################

    create table(:customers) do
      add :name, :string
      add :phone_number, :string
      add :auth_token, :string
      timestamps()
    end


    ##################
    ### Orders
    ##################

    create table(:orders) do
      add :motoboy_id, references(:motoboys)
      add :customer_id, references(:customers)
      add :price, :integer
      add :state, :string, default: "pending"
      add :confirmed_at, :utc_datetime
      add :finished_at, :utc_datetime
      add :canceled_at, :utc_datetime
      add :last_order_received_at, :utc_datetime, usec: true
      timestamps()
    end

    create table(:stops) do
      add :order_id, references(:orders)
      add :sequence, :integer, limit: 2
      add :instructions, :text
    end

    create table(:locations) do
      add :stop_id, references(:stops)
      add :customer_id, references(:customers)
      add :name, :string
      add :street, :string
      add :number, :string
      add :neighborhood, :string
      add :zipcode, :string
      add :complement, :string
      add :reference, :string
      add :city, :string
      add :uf, :string
      add :lat, :string
      add :lng, :string
      add :formatted_address, :string
      add :formatted_phone_number, :string
      add :google_place_id, :string
      add :used_count, :integer, limit: 5
      add :last_used_at, :utc_datetime
    end

    create table(:history) do
      add :order_id, references(:orders)
      add :motoboy_id, references(:motoboys)
      add :event, :string
      add :text, :string
      timestamps()
    end


    ##################
    ###  Address
    ##################

    create table(:addresses) do
      add :zipcode, :string
      add :uf, :string
      add :city, :string
      add :neighborhood, :string
      add :street, :string
      add :lat, :string
      add :lng, :string
      add :ibge_cod_uf, :string
      add :ibge_cod_cidade, :string
      add :area_cidade_km2, :string
      add :ddd, :string
    end

    create table(:cities) do
      add :name, :string
    end

    create table(:neighborhoods) do
      add :city_id, references(:cities)
      add :name, :string
    end
  end
end
