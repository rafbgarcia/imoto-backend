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
    IO.puts(">>> 1")
    IO.puts(params.centrals_ids)
    IO.puts(">>> 2")

    changeset
    |> cast(params, [:phone_number, :name, :password_hash, :login])
    |> cast_assoc(:location)
    |> put_assoc(:centrals, parse_centrals_ids(params.centrals_ids))
    |> unique_constraint(:login)
  end

  defp parse_centrals_ids(centrals_ids) do
    from(c in Core.Central, where: c.id in ^centrals_ids)
    |> Db.Repo.all
  end
end
