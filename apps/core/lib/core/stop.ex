defmodule Core.Stop do
  use Core, :schema

  schema "stops" do
    belongs_to(:order, Core.Order)
    field(:sequence, :integer)
    field(:instructions, :string)

    field(:street, :string)
    field(:number, :string)
    field(:neighborhood, :string)
    field(:zipcode, :string)
    field(:complement, :string)
    field(:reference, :string)
    field(:city, :string)
    field(:uf, :string)

    field(:address, :string)
    field(:google_place_id, :string)
    field(:lat, :string)
    field(:lng, :string)
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [
      :instructions,
      :sequence,
      :street,
      :number,
      :neighborhood,
      :zipcode,
      :complement,
      :reference,
      :city,
      :uf,
      :address,
      :google_place_id,
      :lat,
      :lng
    ])
  end
end
