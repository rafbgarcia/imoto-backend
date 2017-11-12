defmodule Api.Orders.Motoboy do
  use Api, :context
  alias Core.{Motoboy, Central}

  def current(_args, %{context: %{current_motoboy: current_motoboy}}) do
    {:ok, current_motoboy}
  end

  def all(_args, %{context: %{current_central: current_central}}) do
    motoboys = from(m in Motoboy,
      where: [central_id: ^current_central.id],
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
        Absinthe.Subscription.publish(Api.Endpoint, motoboy, [motoboy_updates: motoboy.central_id])
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
        Absinthe.Subscription.publish(Api.Endpoint, motoboy, [motoboy_updates: motoboy.central_id])
        Api.Orders.History.motoboy_unavailable(motoboy.id)
        {:ok, motoboy}
    end
  end

  @doc """
  Motoboy was offline and became online.
  """
  def make_available_and_publish(_args, %{context: %{current_motoboy: current_motoboy}}) do
    with {:ok, motoboy} <- make_available_and_publish(current_motoboy) do
      Api.Orders.History.motoboy_available(motoboy.id)
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
        Absinthe.Subscription.publish(Api.Endpoint, motoboy, [motoboy_updates: motoboy.central_id])
        {:ok, motoboy}
    end
  end

  @doc """
  Get next motoboy in queue and mark his state as "busy"
  to avoid him from being picked for the next order.
  Use pessimistic locking to avoid sending 2 orders to the same motoboy.
  Publish his new state.
  """
  def get_next_in_queue_and_publish do
    get_next_in_queue()
    |> case do
      {:ok, :error} ->
        {:error, "Nenhum motoboy disponível no momento"}
      {:ok, motoboy} ->
        Absinthe.Subscription.publish(Api.Endpoint, motoboy, [motoboy_state: motoboy.id])
        {:ok, motoboy}
    end
  end

  defp get_next_in_queue do
    Repo.transaction(fn ->
      from(m in Motoboy,
        lock: "FOR UPDATE",
        join: c in assoc(m, :central),
        preload: [central: c],
        where: m.state == "available",
        order_by: [asc: m.became_available_at, asc: c.last_order_taken_at]
      )
      |> first
      |> Repo.one
      |> case do
        nil ->
          :error
        motoboy ->
          motoboy.central |> Central.changeset(%{last_order_taken_at: Timex.local}) |> Repo.update
          motoboy |> Motoboy.changeset(%{state: "busy"}) |> Repo.update
      end
    end)
  end

  def get(id) do
    Motoboy |> Repo.get(id)
  end
end
