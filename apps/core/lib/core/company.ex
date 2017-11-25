defmodule Core.Customer do
  use Core, :schema

  schema "companies" do
    has_many :locations, Core.Location
    has_many :orders, Core.Order
    has_many :customers, Core.Customer
    many_to_many :centrals, Core.Central, join_through: "centrals_companies"

    field :password_hash, :string
    field :name, :string
    field :phone_number, :string
    field :login, :string
    field :password_hash, :string

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:phone_number, :name, :password_hash, :login])
    |> validate_required([:phone_number])
  end
end
