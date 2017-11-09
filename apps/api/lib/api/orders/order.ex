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

  def create(%{params: params}, %{context: %{current_customer: current_customer}}) do
    case create_order(params, current_customer) do
      {:ok, %{error: errors}} -> {:ok, %{error: errors}}
      {:ok, order} ->
        motoboy = Api.Orders.Motoboy.next_in_queue!
        Absinthe.Subscription.publish(Api.Endpoint, order, [motoboy_orders: motoboy.id])
        {:ok, order}
    end
  end
  def create(_, %{context: %{current_customer: nil}}) do
    {:ok, %{error: "Algo deu errado, por favor feche e reabra a app"}}
  end

  defp create_order(params, customer) do
    params = Map.put(params, :customer_id, customer.id)

    Core.Order.changeset(%Core.Order{}, params)
    |> Repo.insert
    |> case do
      {:ok, order} -> {:ok, order}
      {:error, errors} -> {:ok, %{error: errors}}
    end
  end

  def cancel(%{order_id: order_id}, _ctx) do
    cancel(order_id)
    |> case do
      {:ok, order} ->
        Api.Orders.History.did_cancel_order(order)
        {:ok, order}
      {:error, _} -> {:ok, %{error: "Ocorreu um erro ao cancelar o pedido"}}
    end
  end
  defp cancel(order_id) do
    get_order(order_id)
    |> Core.Order.changeset(%{state: "canceled", canceled_at: Timex.local})
    |> Repo.update
  end

  def confirm(%{order_id: order_id}, %{context: %{current_motoboy: current_motoboy}}) do
    case confirm_order(order_id, current_motoboy) do
      {:ok, order} -> {:ok, order}
      {:error, error} -> {:ok, %{error: error}}
    end
  end

  defp confirm_order(order_id, motoboy) do
    Repo.transaction(fn ->
      order = confirm!(order_id, motoboy.id)
      Api.Orders.Motoboy.mark_busy!(motoboy)
      Api.Orders.History.did_confirm_order(order)
      Api.Orders.History.motoboy_busy(motoboy)
      order
    end)
  rescue
    # This should never happen, the system takes care
    Ecto.NoResultsError -> {:error,  "Nenhum motoboy disponível"}
  end

  defp confirm!(order_id, motoboy_id) do
    get_order(order_id)
    |> Core.Order.changeset(%{state: "confirmed", motoboy_id: motoboy_id, confirmed_at: Timex.local})
    |> Repo.update!
  end

  defp get_order(id) do
    Repo.get(Core.Order, id)
  end
end
