defmodule Core.Central do
  use Core, :schema

  schema "centrals" do
    field :name, :string
    field :login, :string
    field :password, :string
    field :available, :boolean
    field :phone_number, :string
    field :became_available_at, Timex.Ecto.DateTime
    field :became_unavailable_at, Timex.Ecto.DateTime

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:name])
    |> validate_required([:name])
    |> unique_constraint(:login)
  end
end
