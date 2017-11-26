defmodule Core.Company do
  use Core, :schema

  schema "companies" do
    has_one :location, Core.Location
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
    |> cast_assoc(:location)
    |> unique_constraint(:login)
  end
end
