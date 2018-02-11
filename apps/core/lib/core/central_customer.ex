defmodule Core.CentralCustomer do
  use Core, :schema

  schema "central_customers" do
    belongs_to(:central, Core.Central)
    has_many(:orders, Core.Order)

    field(:name, :string)
    field(:phone_number, :string)
    field(:street, :string)
    field(:number, :string)
    field(:neighborhood, :string)
    field(:zipcode, :string)
    field(:complement, :string)
    field(:reference, :string)
    field(:city, :string)
    field(:uf, :string)
    field(:lat, :decimal)
    field(:lng, :decimal)

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [
      :central_id,
      :name,
      :phone_number,
      :street,
      :number,
      :neighborhood,
      :zipcode,
      :complement,
      :reference,
      :city,
      :uf,
      :lat,
      :lng
    ])
    |> validate_required([:name, :central_id])
  end
end
