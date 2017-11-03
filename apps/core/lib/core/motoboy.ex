defmodule Core.Motoboy do
  use Core, :schema

  use EctoStateMachine,
    states: [:unavailable, :available, :busy],
    events: [
      [
        name:     :make_available,
        from:     [:busy, :unavailable],
        to:       :available,
        callback: fn(motoboy) ->
          # TODO: add to History
        end
      ], [
        name:     :make_unavailable,
        from:     [:available],
        to:       :unavailable,
        callback: fn(motoboy) ->
          # TODO: add to History
        end
      ]
    ]

  schema "motoboys" do
    belongs_to :central, Core.Central
    field :name, :string
    field :state, :string
    field :login, :string
    field :password, :string
    field :auth_token, :string

    timestamps()
  end

  def changeset(changeset, params \\ %{}) do
    changeset
    |> cast(params, [:name])
    |> validate_required([:name])
    |> unique_constraint(:login)
  end
end