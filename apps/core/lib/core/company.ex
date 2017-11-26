defmodule Core.Company do
  use Core, :schema

  schema "companies" do
    has_many :locations, Core.Location
    has_many :orders, Core.Order
    has_many :customers, Core.Customer
    many_to_many :centrals, Core.Central, join_through: "companies_centrals"

    field :password_hash, :string
    field :name, :string
    field :phone_number, :string
    field :login, :string
    field :token, :string, virtual: true

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:phone_number, :name, :password_hash, :login])
    |> unique_constraint(:login)
  end
end
