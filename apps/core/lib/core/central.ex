defmodule Core.Central do
  use Core, :schema

  schema "centrals" do
    has_many :motoboys, Core.Motoboy
    has_many :orders, through: [:motoboys, :orders]
    many_to_many :companies, Core.Company, join_through: "companies_centrals"

    field :name, :string
    field :login, :string
    field :password_hash, :string
    field :phone_number, :string
    field :active, :boolean
    field :last_order_taken_at, Timex.Ecto.DateTime
    field :token, :string, virtual: true

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [
      :name, :phone_number, :last_order_taken_at, :password_hash, :login, :active
    ])
    |> validate_required([:name])
    |> unique_constraint(:login)
  end
end
