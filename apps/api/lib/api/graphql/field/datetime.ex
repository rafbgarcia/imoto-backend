defmodule Api.Graphql.Field.Datetime do
  use Api, :graphql_schema

  use Timex
  scalar :datetime, description: "ISOz time" do
    parse &Timex.parse(&1.value, "{ISO:Extended:Z}")
    serialize &Timex.format!(&1, "{ISO:Extended:Z}")
  end
end
