defmodule Api.Orders.Order do
  use Api, :context

  alias Core.Order

  def all(_args, _ctx) do
    {:ok, Order |> Repo.all}
  end

  def get(%{id: id}, %{context: %{current_customer: current_customer}}) do
    Order
    |> where(id: ^id, customer_id: ^current_customer.id)
    |> first |> Repo.one
    |> case do
      nil -> {:ok, %{error: "Pedido não encontrado"}}
      order -> {:ok, order}
    end
  end

  def pending(%{state: state}, _args, _ctx) do
    {:ok, state == Order.pending}
  end

  def confirmed(%{state: state}, _args, _ctx) do
    {:ok, state == Order.confirmed}
  end

  def finished(%{state: state}, _args, _ctx) do
    {:ok, state == Order.finished}
  end

  def no_motoboy(%{state: state}, _args, _ctx) do
    {:ok, state == Order.no_motoboys}
  end

  def canceled(%{state: state}, _args, _ctx) do
    {:ok, state == Order.canceled}
  end

  def formatted_price(%Order{} = order, _args, _ctx) do
    {:ok, Money.to_string(order.price)}
  end

  @doc """
  onCreateOrder
    -> Insert order
    -> Add to History
    -> Notify next motoboy in queue
    -> Spawn after create order
  """
  def create(_, %{context: %{current_customer: nil}}) do
    {:ok, %{error: "Algo deu errado, por favor feche e abra a app, e tente novamente"}}
  end
  def create(%{params: params, customer_params: customer_params}, %{context: %{current_customer: current_customer}}) do
    Api.Orders.Customer.update(current_customer, customer_params)

    with {:ok, motoboy} <- Api.Orders.Motoboy.get_next_in_queue do
      params = params
      |> Map.put(:customer_id, current_customer.id)
      |> Map.put(:motoboy_id, motoboy.id)
      |> Map.put(:state, "pending")
      |> Map.put(:price, 1232) # TODO: fix this

      Order.changeset(%Order{}, params)
      |> Repo.insert
      |> case do
        {:ok, order} ->
          Api.Orders.History.new_order(order.id, motoboy.id)
          spawn fn -> after_create(order) end
          {:ok, order}
        {:error, errors} ->
          {:ok, %{error: errors}}
      end
    else
      {:error, error} -> {:ok, %{error: error}}
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
  def cancel(%{order_id: order_id, reason: _reason}, %{context: %{current_motoboy: current_motoboy}}) do
    with order <- get_order(order_id) do
      Api.Orders.History.order_canceled(order.id, current_motoboy.id)

      with {:ok, new_motoboy} <- Api.Orders.Motoboy.get_next_of_same_central(current_motoboy) do
        {:ok, order} = set_new_motoboy(order, new_motoboy)
        Api.Orders.History.order_new_motoboy(order.id, new_motoboy.id)
      else
        {:error, _} ->
          set_no_motoboys(order)
      end

      Api.Orders.Motoboy.did_cancel_order(current_motoboy)
      {:ok, order}
    end
  end
  defp set_new_motoboy(order, motoboy) do
    order
    |> Order.changeset(%{motoboy_id: motoboy.id})
    |> Repo.update
  end
  defp set_no_motoboys(order) do
    order
    |> Order.changeset(%{state: Order.no_motoboys})
    |> Repo.update
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
      order = confirm_order!(order_id)
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

  defp confirm_order!(order_id) do
    get_order(order_id)
    |> Order.changeset(%{state: Order.confirmed, confirmed_at: Timex.local})
    |> Repo.update!
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

  defp finish_order!(order_id) do
    get_order(order_id)
    |> Order.changeset(%{state: Order.finished, finished_at: Timex.local})
    |> Repo.update!
  end

  defp get_order(id) do
    Repo.get(Order, id)
  end

  # Parallel
  defp after_create(order) do
    Api.Orders.Location.after_create_order(order)
  end
end
