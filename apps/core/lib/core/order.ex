defmodule Core.Order do
  use Core, :schema

  @doc """
  Order pending motoboy confirmation
  """
  def pending, do: "pending"

  @doc """
  Order confirmed by motoboy
  """
  def confirmed, do: "confirmed"

  @doc """
  Order finished
  """
  def finished, do: "finished"

  @doc """
  Order is in queue waiting for the next available motoboy
  """
  def in_queue, do: "in_queue"

  @doc """
  Order was canceled by creator (Central, Company, Customer)
  """
  def canceled, do: "canceled"

  schema "orders" do
    has_many(:stops, Core.Stop)
    has_many(:cancelations, Core.OrderCancelation)
    has_many(:locations, through: [:stops, :location])
    belongs_to(:central, Core.Central)
    belongs_to(:motoboy, Core.Motoboy)
    belongs_to(:company, Core.Company)
    belongs_to(:customer, Core.Customer)
    belongs_to(:central_customer, Core.CentralCustomer)
    field(:price, Money.Ecto.Type)
    field(:state, :string)
    field(:confirmed_at, Timex.Ecto.DateTime)
    field(:finished_at, Timex.Ecto.DateTime)

    # Set when the order is created or canceled.
    #
    # Order might be created without going to the queue,
    # so we need to set when the motoboy cancel's it.
    field(:queued_at, Timex.Ecto.DateTime)

    # Set whenever the order is sent to a new motoboy
    field(:sent_at, Timex.Ecto.DateTime)
    field(:canceled_at, Timex.Ecto.DateTime)

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [
      :central_id,
      :motoboy_id,
      :customer_id,
      :company_id,
      :central_customer_id,
      :price,
      :state,
      :confirmed_at,
      :finished_at,
      :canceled_at,
      :queued_at,
      :sent_at
    ])
    |> cast_assoc(:stops)
    |> validate_required([:state])
    |> validate_inclusion(:state, [pending(), confirmed(), finished(), in_queue()])
  end
end
