defmodule Core.Company do
  use Core, :schema

  schema "companies" do
    belongs_to :central, Core.Central
    has_one :location, Core.Location
    has_many :orders, Core.Order
    has_many :customers, Core.Customer
    many_to_many :centrals, Core.Central, join_through: "companies_centrals"

    field :password_hash, :string
    field :name, :string
    field :phone_number, :string
    field :email, :string
    field :token, :string, virtual: true

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    case params["centrals_ids"] do
      nil -> nil
      ids -> put_assoc(changeset, :centrals, parse_centrals_ids(ids))
    end

    changeset
    |> cast(params, [:phone_number, :name, :central_id, :password_hash, :email])
    |> validate_required([:name])
    |> cast_assoc(:location)
    |> unique_constraint(:email)
  end

  defp parse_centrals_ids(centrals_ids) do
    case centrals_ids do
      nil -> []
      ids ->
        from(c in Core.Central, where: c.id in ^ids)
        |> Db.Repo.all
    end
  end
end
