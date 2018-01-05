defmodule Motoboy.Resolve.CancelOrder do
  use Api, :resolver

  alias Core.{History, Order}

  @doc "returns the current motoboy because he's the one making this request"
  def handle(%{order_id: order_id, reason: _reason}, %{context: %{current_motoboy: current_motoboy}}) do
    order = Motoboy.SharedFunctions.get_order!(order_id, current_motoboy.id)
    add_cancel_to_history(order.id, current_motoboy.id)

    {:ok, new_motoboy} = get_next_motoboy(current_motoboy)
    update_order_new_motoboy(order, current_motoboy, new_motoboy)
  end

  defp update_order_new_motoboy(order, current_motoboy, nil) do
    Repo.transaction(fn ->
      set_no_motoboys!(order)
      add_order_no_motoboys_to_history(order.id)
      {:ok, current_motoboy} = Motoboy.SharedFunctions.make_available(current_motoboy)

      current_motoboy
    end)
  end
  defp update_order_new_motoboy(order, current_motoboy, new_motoboy) do
    Repo.transaction(fn ->
      set_new_motoboy!(order, new_motoboy.id)
      add_order_new_motoboy_to_history(order.id, new_motoboy.id)
      {:ok, current_motoboy} = Motoboy.SharedFunctions.make_available(current_motoboy)
      current_motoboy
    end)
  end

  defp get_next_motoboy(%{id: id, central_id: central_id}) do
    Repo.transaction(fn ->
      from(m in Core.Motoboy,
        lock: "FOR UPDATE",
        join: c in assoc(m, :central),
        preload: [central: c],
        where: m.central_id == ^central_id,
        where: m.state == ^Core.Motoboy.available(),
        where: m.id != ^id,
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
        nil -> nil # Repo.rollback("Nenhum motoboy disponível")
        motoboy -> make_motoboy_busy!(motoboy)
      end
    end)
  end

  defp make_motoboy_busy!(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{state: Core.Motoboy.busy()})
    |> Repo.update!
  end

  defp set_new_motoboy!(order, motoboy_id) do
    order
    |> Order.changeset(%{motoboy_id: motoboy_id})
    |> Repo.update!
  end

  defp set_no_motoboys!(order) do
    order
    |> Order.changeset(%{state: Order.no_motoboys(), motoboy_id: nil})
    |> Repo.update!
  end

  defp add_cancel_to_history(order_id, motoboy_id) do
    Repo.insert(%History{scope: "motoboy", text: "Cancelou pedido", order_id: order_id, motoboy_id: motoboy_id})
    Repo.insert(%History{scope: "order", text: "Pedido cancelado", order_id: order_id, motoboy_id: motoboy_id})
  end

  defp add_order_new_motoboy_to_history(order_id, motoboy_id) do
    Repo.insert(%History{scope: "order", text: "Pedido enviado a outro motoboy", order_id: order_id, motoboy_id: motoboy_id})
    Repo.insert(%History{scope: "motoboy", text: "Recebeu pedido", order_id: order_id, motoboy_id: motoboy_id})
  end

  defp add_order_no_motoboys_to_history(order_id) do
    Repo.insert(%History{scope: "order", text: "Pedido cancelado, nenhum motoboy disponível", order_id: order_id})
  end
end
