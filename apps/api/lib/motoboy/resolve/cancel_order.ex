defmodule Motoboy.Resolve.CancelOrder do
  use Api, :resolver

  alias Core.{History, Order}

  @doc """
  returns the current motoboy because he's the one making this request
  """
  def handle(%{order_id: order_id, reason: _}, %{context: %{current_motoboy: motoboy}}) do
    Repo.transaction(fn ->
      new_motoboy = next_available_motoboy(motoboy)

      order =
        Motoboy.SharedFunctions.get_order!(order_id, motoboy.id)
        |> track_cancel(motoboy)
        |> send_to_new_motoboy_or_queue!(new_motoboy)

      motoboy
      |> track_cancel(order)
      |> make_unavailable_if_no_ongoing_orders!
    end)
  end

  defp send_to_new_motoboy_or_queue!(order, nil) do
    send_to_queue!(order)
  end

  defp send_to_new_motoboy_or_queue!(order, new_motoboy) do
    order
    |> send_to_new_motoboy!(new_motoboy)
    |> track_sent_to_new_motoboy(new_motoboy)

    new_motoboy
    |> make_busy!
    |> track_new_order(order)
    |> Central.Shared.NotifyMotoboy.new_order()
  end

  defp make_unavailable_if_no_ongoing_orders!(motoboy) do
    case Motoboy.SharedFunctions.has_ongoing_orders(motoboy) do
      true -> motoboy
      false -> make_motoboy_unavailable!(motoboy)
    end
  end

  defp send_to_queue!(order) do
    order
    |> Order.changeset(%{
      state: Order.in_queue(),
      queued_at: order.inserted_at,
      motoboy_id: nil
    })
    |> Repo.update!()
    |> track_sent_to_queue
  end

  defp next_available_motoboy(%Core.Motoboy{central_id: central_id, id: id}) do
    from(
      m in Core.Motoboy,
      lock: "FOR UPDATE",
      where: m.id != ^id,
      where: m.state == ^Core.Motoboy.available(),
      where: m.active == ^true,
      where: m.central_id == ^central_id,
      order_by: m.became_available_at
    )
    |> first
    |> Repo.one()
  end

  defp send_to_new_motoboy!(order, %Core.Motoboy{id: motoboy_id}) do
    order
    |> Order.changeset(%{motoboy_id: motoboy_id})
    |> Order.changeset(%{sent_at: Timex.local()})
    |> Repo.update!()
  end

  defp track_cancel(%Core.Motoboy{} = motoboy, %Core.Order{id: order_id}) do
    Repo.insert(%History{
      scope: "motoboy",
      text: "Cancelou pedido",
      order_id: order_id,
      motoboy_id: motoboy.id
    })

    motoboy
  end

  defp track_cancel(%Core.Order{} = order, %Core.Motoboy{id: motoboy_id}) do
    Repo.insert(%History{
      scope: "order",
      text: "Motoboy cancelou pedido",
      order_id: order.id,
      motoboy_id: motoboy_id
    })

    order
  end

  defp track_new_order(order, motoboy) do
    Repo.insert(%History{
      scope: "motoboy",
      text: "Recebeu pedido",
      order_id: order.id,
      motoboy_id: motoboy.id
    })

    motoboy
  end

  defp track_sent_to_new_motoboy(order, motoboy) do
    Repo.insert(%History{
      scope: "order",
      text: "Pedido enviado a outro motoboy",
      order_id: order.id,
      motoboy_id: motoboy.id
    })

    order
  end

  defp track_sent_to_queue(order) do
    Repo.insert(%History{
      scope: "order",
      text: "Pedido cancelado e enviado para a fila. Aguardando o próximo motoboy disponível...",
      order_id: order.id
    })

    order
  end

  defp make_motoboy_unavailable!(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{state: Core.Motoboy.unavailable()})
    |> Core.Motoboy.changeset(%{became_unavailable_at: Timex.local()})
    |> Repo.update!()
  end

  defp make_busy!(motoboy) do
    motoboy
    |> Core.Motoboy.changeset(%{state: Core.Motoboy.busy()})
    |> Core.Motoboy.changeset(%{became_busy_at: Timex.local()})
    |> Repo.update!()
  end
end
