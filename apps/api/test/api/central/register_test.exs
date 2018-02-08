defmodule Test.Central.Register do
  use ExUnit.Case
  use Api.ConnCase
  use Api, :testcase

  alias Elixir.Central.Resolve.Register

  test "Happy path" do
    {:ok, central} = Register.handle(%{params: params()}, %{})
    assert central.id != nil
  end

  test "Errors are sent back to the front-end" do
    {:ok, central1} = Register.handle(%{params: params()}, %{})
    {:error, errors} = Register.handle(%{params: params()}, %{})

    assert central1.id != nil
    assert errors == ["Email has already been taken"]
  end

  defp params do
    %{
      accepted_terms_of_use: true,
      cnpj: "01.293.012/3901-23",
      email: "rafbgarcia@gmail.com",
      name: "thor refeições",
      password: "admin",
      phone_number: "(84) 98141-4140"
    }
  end
end
