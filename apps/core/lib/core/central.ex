defmodule Core.Central do
  use Core, :schema

  schema "centrals" do
    field :name, :string
    field :login, :string
    field :password, :string
    field :available, :boolean
    field :phone_number, :string
    field :last_opened_at, Timex.Ecto.DateTimeWithTimezone
    field :last_closed_at, Timex.Ecto.DateTimeWithTimezone

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:name])
    |> validate_required([:name])
    |> unique_constraint(:login)
  end
end
