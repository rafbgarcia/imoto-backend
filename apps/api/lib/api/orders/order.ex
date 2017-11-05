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

  def confirm(%{order_id: order_id} = args, _ctx) do
    case confirm(order_id) do
      {:ok, order} -> {:ok, order}
      {:error, error} -> {:ok, %{error: error}}
    end
  end
  defp confirm(order_id) do
    Repo.transaction(fn ->
      motoboy = next_in_queue!
      order = confirm!(order_id, motoboy)
      mark_motoboy_busy!(motoboy)
      # Api.Orders.History.did_confirm_order(motoboy, order)
      order
    end)
  rescue
    # This should never happen, the system takes care
    Ecto.NoResultsError -> {:error,  "Nenhum motoboy disponível"}
  end

  defp confirm!(order_id, motoboy) do
    Repo.get(Core.Order, order_id)
    |> Core.Order.changeset(%{state: "confirmed", motoboy_id: motoboy.id, confirmed_at: Timex.local})
    |> Repo.update!
  end

  defp mark_motoboy_busy!(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{state: "busy", became_busy_at: Timex.local})
    |> Repo.update!
  end

  defp next_in_queue! do
    Core.Motoboy
    # |> where([central_id: central_id])
    |> where([state: "available"])
    |> first([desc: :became_available_at])
    |> Repo.one!
  end
end
