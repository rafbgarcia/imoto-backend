defmodule CentralWeb.CentralControllerTest do
  use CentralWeb.ConnCase

  alias Central.Extranet

  @create_attrs %{available: true, email: "some email", name: "some name", password: "some password", phone_number: "some phone_number"}
  @update_attrs %{available: false, email: "some updated email", name: "some updated name", password: "some updated password", phone_number: "some updated phone_number"}
  @invalid_attrs %{available: nil, email: nil, name: nil, password: nil, phone_number: nil}

  def fixture(:central) do
    {:ok, central} = Extranet.create_central(@create_attrs)
    central
  end

  describe "index" do
    test "lists all centrals", %{conn: conn} do
      conn = get conn, central_path(conn, :index)
      assert html_response(conn, 200) =~ "Listing Centrals"
    end
  end

  describe "new central" do
    test "renders form", %{conn: conn} do
      conn = get conn, central_path(conn, :new)
      assert html_response(conn, 200) =~ "New Central"
    end
  end

  describe "create central" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn = post conn, central_path(conn, :create), central: @create_attrs

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == central_path(conn, :show, id)

      conn = get conn, central_path(conn, :show, id)
      assert html_response(conn, 200) =~ "Show Central"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, central_path(conn, :create), central: @invalid_attrs
      assert html_response(conn, 200) =~ "New Central"
    end
  end

  describe "edit central" do
    setup [:create_central]

    test "renders form for editing chosen central", %{conn: conn, central: central} do
      conn = get conn, central_path(conn, :edit, central)
      assert html_response(conn, 200) =~ "Edit Central"
    end
  end

  describe "update central" do
    setup [:create_central]

    test "redirects when data is valid", %{conn: conn, central: central} do
      conn = put conn, central_path(conn, :update, central), central: @update_attrs
      assert redirected_to(conn) == central_path(conn, :show, central)

      conn = get conn, central_path(conn, :show, central)
      assert html_response(conn, 200) =~ "some updated email"
    end

    test "renders errors when data is invalid", %{conn: conn, central: central} do
      conn = put conn, central_path(conn, :update, central), central: @invalid_attrs
      assert html_response(conn, 200) =~ "Edit Central"
    end
  end

  describe "delete central" do
    setup [:create_central]

    test "deletes chosen central", %{conn: conn, central: central} do
      conn = delete conn, central_path(conn, :delete, central)
      assert redirected_to(conn) == central_path(conn, :index)
      assert_error_sent 404, fn ->
        get conn, central_path(conn, :show, central)
      end
    end
  end

  defp create_central(_) do
    central = fixture(:central)
    {:ok, central: central}
  end
end
