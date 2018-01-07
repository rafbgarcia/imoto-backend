defmodule Db.Repo.Migrations.CreateCentrals do
  use Ecto.Migration

  def change do
    ##################
    ### Centrals
    ##################

    create table(:centrals) do
      add :name, :string
      add :phone_number, :string, unique: true
      add :email, :string, unique: true
      add :login, :string, unique: true
      add :password_hash, :string
      add :cnpj, :string
      add :accepted_terms_of_use, :boolean, default: false, null: false
      add :active, :boolean, default: false, null: false
      timestamps()
    end

    create table(:motoboys) do
      add :name, :string
      add :central_id, references(:centrals)
      add :state, :string, default: "unavailable"
      add :phone_number, :string, unique: true
      add :one_signal_player_id, :string
      add :became_unavailable_at, :utc_datetime
      add :became_available_at, :utc_datetime
      add :became_busy_at, :utc_datetime
      add :active, :boolean, default: true, null: false
      timestamps()
    end

    ##################
    ### Company
    ##################

    create table(:companies) do
      add :central_id, references(:centrals)
      add :name, :string
      add :login, :string, unique: true
      add :password_hash, :string
      add :phone_number, :string
      timestamps()
    end

    create table(:companies_centrals) do
      add :central_id, references(:centrals, on_delete: :delete_all)
      add :company_id, references(:companies, on_delete: :delete_all)
    end


    ##################
    ### Customers
    ##################

    create table(:customers) do
      add :company_id, references(:companies, on_delete: :delete_all)
      add :name, :string
      add :phone_number, :string
      timestamps()
    end

    ##################
    ### Central Orders
    ##################

    create table(:orders) do
      add :motoboy_id, references(:motoboys, on_delete: :nilify_all)
      add :company_id, references(:companies, on_delete: :nilify_all)
      add :customer_id, references(:customers, on_delete: :nilify_all)
      add :price, :integer
      add :state, :string, default: "pending"
      add :confirmed_at, :utc_datetime
      add :finished_at, :utc_datetime
      add :canceled_at, :utc_datetime
      add :last_order_received_at, :utc_datetime, usec: true
      timestamps()
    end

    create table(:stops) do
      add :order_id, references(:orders, on_delete: :delete_all)
      add :location_id, references(:locations, on_delete: :nilify_all)
      add :sequence, :integer, limit: 2
      add :instructions, :text
    end

    create table(:locations) do
      add :stop_id, references(:stops, on_delete: :delete_all)
      add :customer_id, references(:customers, on_delete: :nilify_all)
      add :company_id, references(:companies, on_delete: :nilify_all)
      add :name, :string
      add :street, :string
      add :number, :string
      add :neighborhood, :string
      add :zipcode, :string
      add :complement, :string
      add :reference, :string
      add :city, :string
      add :uf, :string
      add :lat, :decimal, precision: 14, scale: 11
      add :lng, :decimal, precision: 14, scale: 11
      add :formatted_address, :string
      add :formatted_phone_number, :string
      add :google_place_id, :string
      add :used_count, :integer, limit: 5
      add :last_used_at, :utc_datetime
    end

    create table(:history) do
      add :order_id, references(:orders, on_delete: :nilify_all)
      add :motoboy_id, references(:motoboys, on_delete: :nilify_all)
      add :scope, :string
      add :text, :string
      timestamps()
    end

    ##################
    ###  Address
    ##################

    # create table(:addresses) do
    #   add :zipcode, :string
    #   add :uf, :string
    #   add :city, :string
    #   add :neighborhood, :string
    #   add :street, :string
    #   add :lat, :string
    #   add :lng, :string
    #   add :ibge_cod_uf, :string
    #   add :ibge_cod_cidade, :string
    #   add :area_cidade_km2, :string
    #   add :ddd, :string
    # end

    # create table(:cities) do
    #   add :name, :string
    # end

    # create table(:neighborhoods) do
    #   add :city_id, references(:cities)
    #   add :name, :string
    # end
  end
end
