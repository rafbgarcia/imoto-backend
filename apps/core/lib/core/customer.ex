defmodule Core.Customer do
  use Core, :schema

  schema "customers" do
    field :name, :string
    field :phone_number, :string
    field :auth_token, :string

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:phone_number])
    |> validate_required([:phone_number])
  end
end
