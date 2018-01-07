defmodule Core.Central do
  use Core, :schema

  schema "centrals" do
    has_many :motoboys, Core.Motoboy
    has_many :orders, through: [:motoboys, :orders]
    has_many :my_companies, Core.Company, foreign_key: :central_id
    many_to_many :companies, Core.Company, join_through: "companies_centrals"

    field :name, :string
    field :login, :string
    field :password_hash, :string
    field :phone_number, :string
    field :active, :boolean
    field :created_by_central, :boolean
    field :token, :string, virtual: true

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [
      :name, :phone_number, :password_hash, :login, :active
    ])
    |> validate_required([:name])
    |> unique_constraint(:login)
  end
end
