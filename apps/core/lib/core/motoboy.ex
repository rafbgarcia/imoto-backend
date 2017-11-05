defmodule Core.Motoboy do
  use Core, :schema

  # use EctoStateMachine,
  #   states: [:unavailable, :available, :busy],
  #   events: [
  #     [
  #       name:     :make_available,
  #       from:     [:busy, :unavailable],
  #       to:       :available,
  #       callback: fn(motoboy) ->
  #         Chanset.change(motoboy, became_available_at: Ecto.DateTime.utc)
  #         # TODO: add to History
  #       end
  #     ], [
  #       name:     :in_delivery,
  #       from:     [:available],
  #       to:       :busy,
  #       callback: fn(motoboy) ->
  #         Chanset.change(motoboy, became_busy_at: Ecto.DateTime.utc)
  #         # TODO: add to History
  #       end
  #     ], [
  #       name:     :make_unavailable,
  #       from:     [:available],
  #       to:       :unavailable,
  #       callback: fn(motoboy) ->
  #         # TODO: add to History
  #       end
  #     ]
  #   ]

  schema "motoboys" do
    belongs_to :central, Core.Central
    field :name, :string
    field :state, :string
    field :login, :string
    field :password, :string
    field :auth_token, :string
    field :became_available_at, Timex.Ecto.DateTime
    field :became_busy_at, Timex.Ecto.DateTime

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:name, :became_available_at, :became_busy_at, :state, :auth_token])
    |> validate_required([:name])
    |> unique_constraint(:login)
  end
end
