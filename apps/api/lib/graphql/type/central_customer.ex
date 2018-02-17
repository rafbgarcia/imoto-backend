defmodule Graphql.Type.CentralCustomer do
  use Api, :graphql_schema

  object :central_customer do
    field(:id, :id)
    field(:name, :string)
    field(:phone_number, :string)
    field(:street, :string)
    field(:number, :string)
    field(:complement, :string)
    field(:neighborhood, :string)
    field(:zipcode, :string)
    field(:reference, :string)
    field(:city, :string)
    field(:uf, :string)
    field(:address, :string)
    field(:google_place_id, :string)
    field(:lat, :string)
    field(:lng, :string)
    field(:line1, :string, resolve: &Central.Resolve.Customer.Fields.line1/3)
  end
end
