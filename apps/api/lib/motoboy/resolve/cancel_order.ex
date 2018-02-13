defmodule Motoboy.Resolve.CancelOrder do
  use Api, :resolver

  alias Core.{History, Order}

  @doc """
  returns the current motoboy because he's the one making this request
  """
  def handle(%{order_id: order_id, reason: _}, %{context: %{current_motoboy: motoboy}}) do
    Repo.transaction(fn ->
      process!(order_id, motoboy)
    end)
  end

  defp process!(order_id, motoboy) do
    order = Motoboy.SharedFunctions.get_order!(order_id, motoboy.id)

    add_cancel_to_history(order.id, motoboy.id)

    next_available_motoboy(motoboy.central_id, motoboy.id)
    |> case do
      nil -> process_order_without_motoboy_available!(order)
      new_motoboy -> process_order_with_new_motoboy!(order, new_motoboy)
    end

    make_motoboy_unavailable!(motoboy)
  end

  defp process_order_with_new_motoboy!(order, new_motoboy) do
    make_motoboy_busy!(new_motoboy)
    update_order_with_new_motoboy!(order, new_motoboy.id)
    Central.Shared.NotifyMotoboy.new_order(new_motoboy.one_signal_player_id)
    add_order_new_motoboy_to_history(order.id, new_motoboy.id)
  end

  defp process_order_without_motoboy_available!(order) do
    send_order_to_queue!(order)
    add_order_in_queue_to_history(order.id)
  end

  defp next_available_motoboy(central_id, current_motoboy_id) do
    from(
      m in Core.Motoboy,
      lock: "FOR UPDATE",
      where: m.id != ^current_motoboy_id,
      where: m.state == ^Core.Motoboy.available(),
      where: m.active == ^true,
      where: m.central_id == ^central_id,
      order_by: m.became_available_at
    )
    |> first
    |> Repo.one()
  end

  defp update_order_with_new_motoboy!(order, motoboy_id) do
    order
    |> Order.changeset(%{motoboy_id: motoboy_id})
    |> Repo.update!()
  end

  defp send_order_to_queue!(order) do
    order
    |> Order.changeset(%{
      state: Order.in_queue(),
      queued_at: order.inserted_at,
      motoboy_id: nil
    })
    |> Repo.update!()
  end

  defp add_cancel_to_history(order_id, motoboy_id) do
    Repo.insert(%History{
      scope: "motoboy",
      text: "Cancelou pedido",
      order_id: order_id,
      motoboy_id: motoboy_id
    })

    Repo.insert(%History{
      scope: "order",
      text: "Motoboy cancelou pedido",
      order_id: order_id,
      motoboy_id: motoboy_id
    })
  end

  defp add_order_new_motoboy_to_history(order_id, motoboy_id) do
    Repo.insert(%History{
      scope: "order",
      text: "Pedido enviado a outro motoboy",
      order_id: order_id,
      motoboy_id: motoboy_id
    })

    Repo.insert(%History{
      scope: "motoboy",
      text: "Recebeu pedido",
      order_id: order_id,
      motoboy_id: motoboy_id
    })
  end

  defp add_order_in_queue_to_history(order_id) do
    Repo.insert(%History{
      scope: "order",
      text: "Pedido cancelado e enviado para a fila. Aguardando o próximo motoboy disponível...",
      order_id: order_id
    })
  end

  defp make_motoboy_unavailable!(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{
      state: Core.Motoboy.unavailable(),
      became_unavailable_at: Timex.local()
    })
    |> Repo.update!()
  end

  defp make_motoboy_busy!(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{state: Core.Motoboy.busy()})
    |> Repo.update!()
  end
end
