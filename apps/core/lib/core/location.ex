defmodule Core.Location do
  use Core, :schema

  schema "locations" do
    belongs_to :stop, Core.Stop
    belongs_to :customer, Core.Customer
    belongs_to :company, Core.Company
    field :name, :string
    field :street, :string
    field :number, :string
    field :neighborhood, :string
    field :zipcode, :string
    field :complement, :string
    field :reference, :string
    field :city, :string
    field :uf, :string
    field :lat, :decimal
    field :lng, :decimal
    field :google_place_id, :string
    field :formatted_address, :string
    field :formatted_phone_number, :string
    field :used_count, :integer, default: 0
    field :last_used_at, Timex.Ecto.DateTime
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [
      :customer_id, :company_id, :stop_id,
      :name, :street, :number, :neighborhood, :zipcode, :formatted_address, :formatted_phone_number,
      :complement, :reference, :city, :uf, :lat, :lng, :google_place_id,
      :last_used_at, :used_count,
    ])
    |> validate_required([:street])
  end
end
