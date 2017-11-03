defmodule Central.Extranet.Central do
  use Ecto.Schema
  import Ecto.Changeset
  alias Central.Extranet.Central


  schema "centrals" do
    field :available, :boolean, default: false
    field :email, :string
    field :name, :string
    field :password, :string
    field :phone_number, :string

    timestamps()
  end

  @doc false
  def changeset(%Central{} = central, attrs) do
    central
    |> cast(attrs, [:name, :email, :password, :available, :phone_number])
    |> validate_required([:name, :email, :password, :available, :phone_number])
  end
end
