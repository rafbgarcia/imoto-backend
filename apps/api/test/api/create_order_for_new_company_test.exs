defmodule Test.CreateOrderForNewCompanyTest do
  use ExUnit.Case
  use Api.ConnCase
  use Api, :testcase

  alias Elixir.Central.Resolve.CreateOrderForNewCompany

  test "#handle - happy path" do
    central = Repo.insert!(%Core.Central{name: "A Central"})
    motoboy = Repo.insert!(Motoboy.changeset(%Motoboy{
      central_id: central.id,
      name: "A Central",
      phone_number: "(84) 91413-1023",
      state: "available"
    }))

    company_params = %{
      name: "A Company",
      phone_number: "(45) 4123-1323",
      location: %{
        street: "Rua Alguma Coisa",
        number: "18",
        complement: "apt 212",
        zipcode: "85812-230",
        reference: "Perto da vila naval",
      }
    }

    {:ok, order} = CreateOrderForNewCompany.handle(
      %{company_params: company_params},
      %{context: %{current_central: central}}
    )

    company = Repo.preload(order, :company).company
    location = Repo.preload(company, :location).location
    stop = Enum.at(Repo.preload(order, :stops).stops, 0)

    assert is_integer(order.id)
    assert is_integer(location.id)
    assert is_integer(company.id)
    assert stop.sequence == 0
    assert stop.location_id == location.id
    assert String.length(stop.instructions) > 0
    assert Repo.aggregate(Order, :count, :id) == 1
    assert Repo.aggregate(Company, :count, :id) == 1
    assert Repo.aggregate(Location, :count, :id) == 1
    assert Repo.aggregate(Stop, :count, :id) == 1
    assert Repo.aggregate(Motoboy, :count, :id) == 1
    assert Repo.aggregate(Central, :count, :id) == 1
    assert Repo.get(Motoboy, motoboy.id).state == "busy"
    assert order.motoboy_id == motoboy.id
    assert order.company_id == company.id
  end

  test "#handle - handle empty location" do
    assert Repo.aggregate(Location, :count, :id) == 0

    central = Repo.insert!(%Core.Central{name: "A Central"})
    motoboy = Repo.insert!(Motoboy.changeset(%Motoboy{
      central_id: central.id,
      name: "A Central",
      phone_number: "(84) 91413-1023",
      state: "available"
    }))

    company_params = %{
      name: "A Company",
      phone_number: "(45) 4123-1323",
      location: %{ street: "" }
    }

    {:ok, order} = CreateOrderForNewCompany.handle(
      %{company_params: company_params},
      %{context: %{current_central: central}}
    )

    company = Repo.get(Company, order.company_id)

    assert order.company_id == company.id
    assert Repo.aggregate(Order, :count, :id) == 1
    assert Repo.aggregate(Company, :count, :id) == 1
    assert Repo.aggregate(Location, :count, :id) == 1
  end
end
