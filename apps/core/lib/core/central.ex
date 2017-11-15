defmodule Core.Central do
  use Core, :schema

  schema "centrals" do
    has_many :motoboys, Core.Motoboy
    has_many :orders, through: [:motoboys, :orders]
    field :name, :string
    field :auth_token, :string
    field :login, :string
    field :password, :string
    field :available, :boolean
    field :phone_number, :string
    field :became_available_at, Timex.Ecto.DateTime
    field :became_unavailable_at, Timex.Ecto.DateTime
    field :last_order_taken_at, Timex.Ecto.DateTime

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [
      :name, :auth_token, :available, :phone_number,
      :became_available_at, :became_unavailable_at, :last_order_taken_at,
    ])
    |> validate_required([:name])
    |> unique_constraint(:login)
  end
end
