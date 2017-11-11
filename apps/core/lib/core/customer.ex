defmodule Core.Customer do
  use Core, :schema

  schema "customers" do
    has_many :locations, Core.Location
    field :name, :string
    field :phone_number, :string
    field :auth_token, :string

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:phone_number, :name, :auth_token])
    |> validate_required([:phone_number])
  end
end
