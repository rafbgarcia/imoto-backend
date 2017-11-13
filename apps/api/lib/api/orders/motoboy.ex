defmodule Api.Orders.Motoboy do
  use Api, :context
  alias Core.{Motoboy, Central, Order}

  def current_order(motoboy, _, _) do
    {:ok, current_order(motoboy)}
  end
  defp current_order(motoboy) do
    from(o in Order,
      where: o.motoboy_id == ^motoboy.id,
      where: o.state in [^Order.pending, ^Order.confirmed]
    )
    |> first
    |> Repo.one
  end

  def current(_args, %{context: %{current_motoboy: current_motoboy}}) do
    {:ok, current_motoboy}
  end

  def all(_args, %{context: %{current_central: current_central}}) do
    {:ok, all_for_central(current_central.id)}
  end

  defp all_for_central(central_id) do
    from(m in Motoboy,
      where: [central_id: ^central_id],
      order_by: fragment(
        """
        CASE m0.state WHEN ? THEN 1 WHEN ? THEN 2 ELSE 3 END,
        m0.became_available_at ASC,
        m0.became_busy_at ASC,
        m0.became_unavailable_at ASC
        """,
        ^Motoboy.available, ^Motoboy.busy
      )
    )
    |> Repo.all
  end

  def first_name(motoboy, _args, _ctx) do
    first_name = motoboy.name |> String.split(" ") |> Enum.at(0)
    {:ok, first_name }
  end

  def available(%{state: state}, _args, _ctx) do
    {:ok, state == Motoboy.available }
  end

  def unavailable(%{state: state}, _args, _ctx) do
    {:ok, state == Motoboy.unavailable }
  end

  def confirming_order(%{state: state}, _args, _ctx) do
    {:ok, state == Motoboy.confirming_order }
  end

  def busy(%{state: state}, _args, _ctx) do
    {:ok, state == Motoboy.busy }
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
    |> Motoboy.changeset(%{state: Motoboy.busy, became_busy_at: Timex.local})
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
    |> Motoboy.changeset(%{state: Motoboy.unavailable, became_unavailable_at: Timex.local})
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
    |> Motoboy.changeset(%{state: Motoboy.available, became_available_at: Timex.local})
    |> Repo.update
    |> case do
      {:ok, motoboy} ->
        Absinthe.Subscription.publish(Api.Endpoint, motoboy, [motoboy_state: motoboy.id])
        Absinthe.Subscription.publish(Api.Endpoint, motoboy, [motoboy_updates: motoboy.central_id])
        {:ok, motoboy}
    end
  end

  @doc """
  This method is called when the order is canceled.
  In this scenario we want to get a motoboy of the same central, if there's any available,
  otherwise it'll get the next motoboy for the next central in the queue.
  """
  def get_next_of_same_central(%{id: id, central_id: central_id} = _motoboy) do
    with {:ok, motoboy} <- get_next_of_same_central(id, central_id) do
      Absinthe.Subscription.publish(Api.Endpoint, motoboy, [motoboy_state: motoboy.id])
      {:ok, motoboy}
    end
  end
  defp get_next_of_same_central(current_motoboy_id, central_id) do
    Repo.transaction(fn ->
      from(m in Motoboy,
        lock: "FOR UPDATE",
        join: c in assoc(m, :central),
        preload: [central: c],
        where: m.central_id == ^central_id,
        where: m.state == ^Motoboy.available,
        where: m.id != ^current_motoboy_id,
        order_by: fragment(
          """
          CASE c1.id WHEN ? THEN 1 ELSE 2 END,
          m0.became_available_at ASC,
          c1.last_order_taken_at ASC
          """, ^central_id
        )
      )
      |> first
      |> Repo.one
      |> case do
        nil ->
          Repo.rollback("Nenhum motoboy disponível")
        motoboy ->
          motoboy.central |> Central.changeset(%{last_order_taken_at: Timex.local}) |> Repo.update!
          motoboy |> Motoboy.changeset(%{state: Motoboy.busy}) |> Repo.update!
      end
    end)
  end

  @doc """
  Get next motoboy in queue and mark his state as "busy"
  to avoid him from being picked for the next order.
  Use pessimistic locking to avoid sending 2 orders to the same motoboy.
  Publish his new state.
  """
  def get_next_in_queue_and_publish do
    with {:ok, motoboy} <- get_next_in_queue() do
      Absinthe.Subscription.publish(Api.Endpoint, motoboy, [motoboy_state: motoboy.id])
      {:ok, motoboy}
    end
  end

  # Gets next motoboy for the next central.
  # If a central has no available motoboys, get a motoboy of the next one.
  defp get_next_in_queue do
    Repo.transaction(fn ->
      from(m in Motoboy,
        lock: "FOR UPDATE",
        join: c in assoc(m, :central),
        preload: [central: c],
        where: m.state == ^Motoboy.available,
        order_by: [asc: m.became_available_at, asc: c.last_order_taken_at]
      )
      |> first
      |> Repo.one
      |> case do
        nil ->
          Repo.rollback("Nenhum motoboy disponível")
        motoboy ->
          motoboy.central |> Central.changeset(%{last_order_taken_at: Timex.local}) |> Repo.update!
          motoboy |> Motoboy.changeset(%{state: Motoboy.busy}) |> Repo.update!
      end
    end)
  end

  def get(id) do
    Motoboy |> Repo.get(id)
  end
end
