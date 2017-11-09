defmodule Core.Motoboy do
  use Core, :schema

  schema "motoboys" do
    belongs_to :central, Core.Central
    field :name, :string
    field :state, :string
    field :login, :string
    field :password, :string
    field :auth_token, :string
    field :became_available_at, Timex.Ecto.DateTime
    field :became_unavailable_at, Timex.Ecto.DateTime
    field :became_busy_at, Timex.Ecto.DateTime

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:name, :became_available_at, :became_unavailable_at, :became_busy_at, :state, :auth_token])
    |> validate_inclusion(:state, ["available", "busy", "unavailable"])
    |> validate_required([:name])
    |> unique_constraint(:login)
  end
end
