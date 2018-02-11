defmodule Core.Customer do
  use Core, :schema

  schema "customers" do
    has_many(:locations, Core.Location)
    belongs_to(:company, Core.Company)
    field(:name, :string)
    field(:phone_number, :string)
    field(:token, :string, virtual: true)
    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:phone_number, :name])
    |> validate_required([:phone_number])
  end
end
