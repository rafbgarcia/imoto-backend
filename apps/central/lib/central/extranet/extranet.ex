defmodule Central.Extranet do
  @moduledoc """
  The Extranet context.
  """

  import Ecto.Query, warn: false
  alias Db.Repo

  alias Central.Extranet.Central

  @doc """
  Returns the list of centrals.

  ## Examples

      iex> list_centrals()
      [%Central{}, ...]

  """
  def list_centrals do
    Repo.all(Central)
  end

  @doc """
  Gets a single central.

  Raises `Ecto.NoResultsError` if the Central does not exist.

  ## Examples

      iex> get_central!(123)
      %Central{}

      iex> get_central!(456)
      ** (Ecto.NoResultsError)

  """
  def get_central!(id), do: Repo.get!(Central, id)

  @doc """
  Creates a central.

  ## Examples

      iex> create_central(%{field: value})
      {:ok, %Central{}}

      iex> create_central(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_central(attrs \\ %{}) do
    %Central{}
    |> Central.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a central.

  ## Examples

      iex> update_central(central, %{field: new_value})
      {:ok, %Central{}}

      iex> update_central(central, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_central(%Central{} = central, attrs) do
    central
    |> Central.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Central.

  ## Examples

      iex> delete_central(central)
      {:ok, %Central{}}

      iex> delete_central(central)
      {:error, %Ecto.Changeset{}}

  """
  def delete_central(%Central{} = central) do
    Repo.delete(central)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking central changes.

  ## Examples

      iex> change_central(central)
      %Ecto.Changeset{source: %Central{}}

  """
  def change_central(%Central{} = central) do
    Central.changeset(central, %{})
  end
end
