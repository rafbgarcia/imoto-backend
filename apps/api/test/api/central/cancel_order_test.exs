defmodule Test.Central.CancelOrder do
  use ExUnit.Case
  use Api.ConnCase
  use Api, :testcase

  alias Elixir.Motoboy.Resolve.CancelOrder
  alias Elixir.Central.Resolve.CreateOrderForNewCompany

  test "No other motoboys available" do
    central = insert_central()
    motoboy = insert_motoboy(central.id)
    assert motoboy.became_unavailable_at == nil

    {:ok, order} = CreateOrderForNewCompany.handle(
      %{company_params: company_params()},
      %{context: %{current_central: central}}
    )
    assert order.id != nil

    {:ok, motoboy} = CancelOrder.handle(
      %{order_id: order.id, reason: ""},
      %{context: %{current_motoboy: motoboy}}
    )
    assert motoboy.state == Core.Motoboy.unavailable()
    assert motoboy.became_unavailable_at != nil
    assert Repo.get(Core.Order, order.id).state == Core.Order.no_motoboys()
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
