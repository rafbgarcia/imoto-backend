defmodule Central.ExtranetTest do
  use Central.DataCase

  alias Central.Extranet

  describe "centrals" do
    alias Central.Extranet.Central

    @valid_attrs %{available: true, email: "some email", name: "some name", password: "some password", phone_number: "some phone_number"}
    @update_attrs %{available: false, email: "some updated email", name: "some updated name", password: "some updated password", phone_number: "some updated phone_number"}
    @invalid_attrs %{available: nil, email: nil, name: nil, password: nil, phone_number: nil}

    def central_fixture(attrs \\ %{}) do
      {:ok, central} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Extranet.create_central()

      central
    end

    test "list_centrals/0 returns all centrals" do
      central = central_fixture()
      assert Extranet.list_centrals() == [central]
    end

    test "get_central!/1 returns the central with given id" do
      central = central_fixture()
      assert Extranet.get_central!(central.id) == central
    end

    test "create_central/1 with valid data creates a central" do
      assert {:ok, %Central{} = central} = Extranet.create_central(@valid_attrs)
      assert central.available == true
      assert central.email == "some email"
      assert central.name == "some name"
      assert central.password == "some password"
      assert central.phone_number == "some phone_number"
    end

    test "create_central/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Extranet.create_central(@invalid_attrs)
    end

    test "update_central/2 with valid data updates the central" do
      central = central_fixture()
      assert {:ok, central} = Extranet.update_central(central, @update_attrs)
      assert %Central{} = central
      assert central.available == false
      assert central.email == "some updated email"
      assert central.name == "some updated name"
      assert central.password == "some updated password"
      assert central.phone_number == "some updated phone_number"
    end

    test "update_central/2 with invalid data returns error changeset" do
      central = central_fixture()
      assert {:error, %Ecto.Changeset{}} = Extranet.update_central(central, @invalid_attrs)
      assert central == Extranet.get_central!(central.id)
    end

    test "delete_central/1 deletes the central" do
      central = central_fixture()
      assert {:ok, %Central{}} = Extranet.delete_central(central)
      assert_raise Ecto.NoResultsError, fn -> Extranet.get_central!(central.id) end
    end

    test "change_central/1 returns a central changeset" do
      central = central_fixture()
      assert %Ecto.Changeset{} = Extranet.change_central(central)
    end
  end
end
