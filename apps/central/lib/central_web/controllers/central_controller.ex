defmodule CentralWeb.CentralController do
  use CentralWeb, :controller

  alias Central.Extranet
  alias Central.Extranet.Central

  def index(conn, _params) do
    centrals = Extranet.list_centrals()
    render(conn, "index.html", centrals: centrals)
  end

  def new(conn, _params) do
    changeset = Extranet.change_central(%Central{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"central" => central_params}) do
    case Extranet.create_central(central_params) do
      {:ok, central} ->
        conn
        |> put_flash(:info, "Central created successfully.")
        |> redirect(to: central_path(conn, :show, central))
      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    central = Extranet.get_central!(id)
    render(conn, "show.html", central: central)
  end

  def edit(conn, %{"id" => id}) do
    central = Extranet.get_central!(id)
    changeset = Extranet.change_central(central)
    render(conn, "edit.html", central: central, changeset: changeset)
  end

  def update(conn, %{"id" => id, "central" => central_params}) do
    central = Extranet.get_central!(id)

    case Extranet.update_central(central, central_params) do
      {:ok, central} ->
        conn
        |> put_flash(:info, "Central updated successfully.")
        |> redirect(to: central_path(conn, :show, central))
      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", central: central, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    central = Extranet.get_central!(id)
    {:ok, _central} = Extranet.delete_central(central)

    conn
    |> put_flash(:info, "Central deleted successfully.")
    |> redirect(to: central_path(conn, :index))
  end
end
