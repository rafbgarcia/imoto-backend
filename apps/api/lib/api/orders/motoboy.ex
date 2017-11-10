defmodule Api.Orders.Motoboy do
  use Api, :context
  alias Core.Motoboy

  def current(_args, %{context: %{current_motoboy: current_motoboy}}) do
    {:ok, current_motoboy}
  end

  def all(_args, _ctx) do
    motoboys = from(m in Motoboy,
      order_by: fragment(
        """
        CASE m0.state WHEN ? THEN 1 WHEN ? THEN 2 ELSE 3 END,
        m0.became_available_at ASC,
        m0.became_busy_at ASC,
        m0.became_unavailable_at ASC
        """, "available", "busy"
      )
    )
    |> Repo.all

    {:ok, motoboys }
  end

  def first_name(motoboy, _args, _ctx) do
    first_name = motoboy.name |> String.split(" ") |> Enum.at(0)
    {:ok, first_name }
  end

  def available(motoboy, _args, _ctx) do
    {:ok, motoboy.state == "available" }
  end

  def unavailable(motoboy, _args, _ctx) do
    {:ok, motoboy.state == "unavailable" }
  end

  def confirming_order(motoboy, _args, _ctx) do
    {:ok, motoboy.state == "confirming_order" }
  end

  def busy(motoboy, _args, _ctx) do
    {:ok, motoboy.state == "busy" }
  end

  def did_confirm_order(motoboy) do
    make_busy_and_publish(motoboy)
  end

  def did_cancel_order(motoboy) do
    make_available_and_publish(motoboy)
  end

  def did_finish_order(motoboy) do
    make_available_and_publish(motoboy)
  end

  defp make_busy_and_publish(motoboy) do
    motoboy
    |> Motoboy.changeset(%{state: "busy", became_busy_at: Timex.local})
    |> Repo.update
    |> case do
      {:ok, motoboy} ->
        Absinthe.Subscription.publish(Api.Endpoint, motoboy, [motoboy_state: motoboy.id])
        motoboy
    end
  end

  @doc """
  Motoboy estava online e ficou offline
  """
  def make_unavailable_and_publish(_args, %{context: %{current_motoboy: current_motoboy}}) do
    current_motoboy
    |> Motoboy.changeset(%{state: "unavailable", became_unavailable_at: Timex.local})
    |> Repo.update
    |> case do
      {:ok, motoboy} ->
        Absinthe.Subscription.publish(Api.Endpoint, motoboy, [motoboy_state: motoboy.id])
        Api.Orders.History.motoboy_unavailable(motoboy.id)
        {:ok, motoboy}
    end
  end

  @doc """
  Motoboy was offline and became online.
  """
  def make_available_and_publish(_args, %{context: %{current_motoboy: current_motoboy}}) do
    with {:ok, motoboy} <- make_available_and_publish(current_motoboy) do
      Api.Orders.History.motoboy_unavailable(motoboy.id)
      {:ok, motoboy}
    end
  end
  defp make_available_and_publish(motoboy) do
    motoboy
    |> Motoboy.changeset(%{state: "available", became_available_at: Timex.local})
    |> Repo.update
    |> case do
      {:ok, motoboy} ->
        Absinthe.Subscription.publish(Api.Endpoint, motoboy, [motoboy_state: motoboy.id])
        {:ok, motoboy}
    end
  end

  @doc """
  Get next motoboy in queue and mark his state as "busy"
  to avoid him from being picked for the next order.
  Publish his new state
  """
  def get_next_in_queue_and_publish do
    Motoboy
    # |> where([central_id: central_id])
    |> where([state: "available"])
    |> first([asc: :became_available_at])
    |> Repo.one!
    |> Motoboy.changeset(%{state: "busy"})
    |> Repo.update
    |> case do
      {:ok, motoboy} ->
        Absinthe.Subscription.publish(Api.Endpoint, motoboy, [motoboy_state: motoboy.id])
        motoboy
    end
  end

  def get(id) do
    Motoboy |> Repo.get(id)
  end
end
