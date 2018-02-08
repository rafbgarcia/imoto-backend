defmodule Test.CreateOrderForNewCompanyTest do
  use ExUnit.Case
  use Api.ConnCase
  use Api, :testcase

  alias Elixir.Central.Resolve.CreateOrderForNewCompany

  test "#handle - happy path" do
    central = insert_central()
    motoboy = insert_motoboy(central.id)

    {:ok, order} = CreateOrderForNewCompany.handle(
      %{company_params: company_params()},
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

  test "Data has empty location" do
    assert Repo.aggregate(Location, :count, :id) == 0

    central = insert_central()
    motoboy = insert_motoboy(central.id)

    {:ok, order} = CreateOrderForNewCompany.handle(
      %{
        company_params: %{
          name: "A Company",
          phone_number: "(45) 4123-1323",
          location: %{ street: "" }
        }
      },
      %{context: %{current_central: central}}
    )

    company = Repo.get(Company, order.company_id)

    assert order.company_id == company.id
    assert Repo.aggregate(Order, :count, :id) == 1
    assert Repo.aggregate(Company, :count, :id) == 1
    assert Repo.aggregate(Location, :count, :id) == 1
  end

  test "Make sure Motoboy order is correct" do
    central = insert_central()
    motoboy1 = insert_motoboy(central.id, %{
      became_available_at: DateTime.from_naive!(~N[2018-02-07 08:00:00.000], "Etc/UTC"),
      active: true
    })
    motoboy2 = insert_motoboy(central.id, %{
      became_available_at: DateTime.from_naive!(~N[2018-02-07 09:00:00.000], "Etc/UTC"),
      active: true
    })
    motoboy3 = insert_motoboy(central.id, %{
      became_available_at: DateTime.from_naive!(~N[2018-02-07 10:00:00.000], "Etc/UTC"),
      active: true
    })

    {:ok, order1} = CreateOrderForNewCompany.handle(
      %{company_params: company_params()},
      %{context: %{current_central: central}}
    )
    {:ok, order2} = CreateOrderForNewCompany.handle(
      %{company_params: company_params()},
      %{context: %{current_central: central}}
    )
    {:ok, order3} = CreateOrderForNewCompany.handle(
      %{company_params: company_params()},
      %{context: %{current_central: central}}
    )

    assert motoboy1.id == Repo.preload(order1, :motoboy).motoboy.id
    assert motoboy2.id == Repo.preload(order2, :motoboy).motoboy.id
    assert motoboy3.id == Repo.preload(order3, :motoboy).motoboy.id
  end

  test "Make sure it accounts for inactive motoboys" do
    central = insert_central()

    motoboy = insert_motoboy(central.id, %{
      became_available_at: DateTime.from_naive!(~N[2018-02-07 07:00:00.000], "Etc/UTC"),
      active: false
    })

    {:error, error} = CreateOrderForNewCompany.handle(
      %{company_params: company_params()},
      %{context: %{current_central: central}}
    )

    assert error == "Nenhum motoboy disponível"
  end

  defp insert_motoboy(central_id, extra_data \\ %{}) do
    params = Map.merge(%Motoboy{
      central_id: central_id,
      name: Faker.Name.name,
      phone_number: Faker.Phone.EnUs.phone,
      state: "available",
    }, extra_data)

    Repo.insert!(Motoboy.changeset(params))
  end

  defp insert_central do
    Repo.insert!(%Core.Central{name: Faker.Name.last_name})
  end

  defp company_params do
    %{
      name: "A Company",
      phone_number: "(45) 4123-1323",
      email: Faker.Name.first_name <> "@gmail.com",
      location: %{
        street: "Rua Alguma Coisa",
        number: "18",
        complement: "apt 212",
        zipcode: "85812-230",
        reference: "Perto da vila naval",
      }
    }
  end
end
