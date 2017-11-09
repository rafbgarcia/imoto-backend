defmodule Api.Orders.Order do
  use Api, :context

  def all(_args, _ctx) do
    {:ok, Core.Order |> Repo.all }
  end

  def pending(%Core.Order{} = order, _args, _ctx) do
    {:ok, order.state == "pending" }
  end

  def confirmed(%Core.Order{} = order, _args, _ctx) do
    {:ok, order.state == "confirmed" }
  end

  def formatted_price(%Core.Order{} = order, _args, _ctx) do
    {:ok, Money.to_string(order.price)}
  end

  @doc """
  onCreateOrder
    -> Insert order
    -> Add to History
    -> Notify next motoboy in queue
  """
  def create(_, %{context: %{current_customer: nil}}) do
    {:ok, %{error: "Algo deu errado, por favor feche e abra a app, e tente novamente"}}
  end
  def create(%{params: params}, %{context: %{current_customer: current_customer}}) do
    params = Map.put(params, :customer_id, current_customer.id)

    Core.Order.changeset(%Core.Order{}, params)
    |> Repo.insert
    |> case do
      {:ok, order} ->
        motoboy = get_and_notify_next_motoboy_in_queue!(order)
        Api.Orders.History.new_order(order.id, motoboy.id)
        {:ok, order}
      {:error, errors} ->
        {:ok, %{error: errors}}
    end
  end

  @doc """
  onCancelOrder
    Step 1
      -> Add to history
      -> Make motoboy available
      -> Publish motoboy's new state
      -> Send motoboy to the end of the available queue
    Step 2
      -> Get a new motoboy
      -> Publish the order to him
      -> Publish his new state
  """
  def cancel(%{order_id: order_id}, %{context: %{current_motoboy: current_motoboy}}) do
    Api.Orders.History.order_canceled(order_id, current_motoboy.id)
    Api.Orders.Motoboy.did_cancel_order(current_motoboy)

    order = get_order(order_id)
    new_motoboy = get_and_notify_next_motoboy_in_queue!(order)
    Api.Orders.History.order_new_motoboy(order.id, new_motoboy.id)

    {:ok, order}
  end

  @doc """
  onConfirmOrder
    -> Confirm order
    -> Add to history
    -> Mark motoboy as busy
    -> Publish motoboy's new state
  """
  def confirm(%{order_id: order_id}, %{context: %{current_motoboy: current_motoboy}}) do
    Repo.transaction(fn ->
      order = confirm_order!(order_id, current_motoboy.id)
      Api.Orders.Motoboy.did_confirm_order(current_motoboy)
      Api.Orders.History.order_confirmed(order.id, current_motoboy.id)
      order
    end)
    |> case do
      {:ok, order} -> {:ok, order}
      {:error, error} -> {:ok, %{error: error}}
    end
  rescue
    # This should never happen, the system should take care of available motoboys
    Ecto.NoResultsError -> {:error,  "Nenhum motoboy disponível"}
  end

  @doc """
  onFinishOrder
    -> Finish order
    -> Add to history
    -> Mark motoboy as available and to the end of the queue
    -> Publish motoboy's new state
  """
  def finish(%{order_id: order_id}, %{context: %{current_motoboy: current_motoboy}}) do
    Repo.transaction(fn ->
      order = finish_order!(order_id)
      Api.Orders.Motoboy.did_finish_order(current_motoboy)
      Api.Orders.History.order_finished(order.id, current_motoboy.id)
      order
    end)
    |> case do
      {:ok, order} -> {:ok, order}
      {:error, error} -> {:ok, %{error: error}}
    end
  rescue
    # This should never happen, the system takes care
    Ecto.NoResultsError -> {:error,  "Nenhum motoboy disponível"}
  end

  defp confirm_order!(order_id, motoboy_id) do
    get_order(order_id)
    |> Core.Order.changeset(%{state: "confirmed", motoboy_id: motoboy_id, confirmed_at: Timex.local})
    |> Repo.update!
  end

  defp finish_order!(order_id) do
    get_order(order_id)
    |> Core.Order.changeset(%{state: "finished", finished_at: Timex.local})
    |> Repo.update!
  end

  defp get_and_notify_next_motoboy_in_queue!(order) do
    motoboy = Api.Orders.Motoboy.get_next_in_queue_and_publish
    Absinthe.Subscription.publish(Api.Endpoint, order, [motoboy_orders: motoboy.id])
    motoboy
  end

  defp get_order(id) do
    Repo.get(Core.Order, id)
  end
end
