defmodule Core.Central do
  use Core, :schema

  schema "centrals" do
    has_many(:motoboys, Core.Motoboy)
    has_many(:orders, Core.Order)
    has_many(:my_companies, Core.Company, foreign_key: :central_id)
    many_to_many(:companies, Core.Company, join_through: "companies_centrals")

    field(:name, :string)
    field(:email, :string)
    field(:cnpj, :string)
    field(:password_hash, :string)
    field(:phone_number, :string)
    field(:active, :boolean)
    field(:accepted_terms_of_use, :boolean)
    field(:token, :string, virtual: true)

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [
      :name,
      :phone_number,
      :cnpj,
      :accepted_terms_of_use,
      :email,
      :password_hash,
      :active
    ])
    |> validate_required([:name, :cnpj, :accepted_terms_of_use])
    |> unique_constraint(:email)
    |> unique_constraint(:cnpj)
  end
end
