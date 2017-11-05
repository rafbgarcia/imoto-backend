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

  def create(%{params: params} = _args, _ctx) do
    Core.Order.changeset(%Core.Order{}, params)
    |> Repo.insert
    |> case do
      {:ok, order} -> {:ok, order}
      {:error, errors} -> {:ok, %{error: errors}}
    end
  end

  def cancel(%{order_id: order_id} = _args, _ctx) do
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

  def confirm(%{order_id: order_id} = _args, _ctx) do
    case confirm(order_id) do
      {:ok, order} -> {:ok, order}
      {:error, error} -> {:ok, %{error: error}}
    end
  end
  defp confirm(order_id) do
    Repo.transaction(fn ->
      motoboy = Api.Orders.Motoboy.next_in_queue!
      order = confirm!(order_id, motoboy)
      Api.Orders.Motoboy.mark_busy!(motoboy)
      Api.Orders.History.did_confirm_order(order)
      Api.Orders.History.motoboy_busy(motoboy)
      order
    end)
  rescue
    # This should never happen, the system takes care
    Ecto.NoResultsError -> {:error,  "Nenhum motoboy disponível"}
  end

  defp confirm!(order_id, motoboy) do
    get_order(order_id)
    |> Core.Order.changeset(%{state: "confirmed", motoboy_id: motoboy.id, confirmed_at: Timex.local})
    |> Repo.update!
  end

  defp get_order(id) do
    Repo.get(Core.Order, id)
  end
end
