defmodule Core.Order do
  use Core, :schema

  use EctoStateMachine,
    states: [:pending, :confirmed, :finished, :canceled],
    events: [
      [
        name:     :confirm,
        from:     [:pending],
        to:       :confirmed,
        callback: fn(order) ->
          # TOOD: write to the history
          Changeset.change(order, confirmed_at: Ecto.DateTime.utc)
        end
      ], [
        name:     :finish,
        from:     [:confirmed],
        to:       :finished,
        callback: fn(order) ->
          # TOOD: write to the history
          Changeset.change(order, finished_at: Ecto.DateTime.utc)
        end
      ], [
        name:     :cancel,
        from:     [:pending, :confirmed],
        to:       :canceled,
        callback: fn(order) ->
          # TOOD: write to the history
          Changeset.change(order, canceled_at: Ecto.DateTime.utc)
        end
      ]
    ]

  schema "orders" do
    has_many :stops, Core.Stop
    belongs_to :motoboy, Core.Motoboy
    belongs_to :customer, Core.Customer
    field :price, Money.Ecto.Type
    field :state, :string
    field :confirmed_at, Timex.Ecto.DateTimeWithTimezone
    field :finished_at, Timex.Ecto.DateTimeWithTimezone
    field :canceled_at, Timex.Ecto.DateTimeWithTimezone

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:price])
    |> validate_required([:price])
  end
end
