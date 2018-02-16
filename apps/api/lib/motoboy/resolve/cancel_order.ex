defmodule Motoboy.Resolve.CancelOrder do
  use Api, :resolver

  alias Core.{History, Order, OrderCancelation, MotoboyGeolocation}

  @doc """
  returns the current motoboy because he's the one making this request
  @param params CancelOrderParams %{order_id, reason, has_order_in_hands}
  """
  def handle(%{params: params}, %{context: %{current_motoboy: motoboy}}) do
    Repo.transaction(fn ->
      new_motoboy = next_available_motoboy(motoboy)

      order =
        Motoboy.SharedFunctions.get_order!(params.order_id, motoboy.id)
        |> insert_cancelation!(params)
        |> track_cancel(motoboy)
        |> send_to_new_motoboy_or_queue!(new_motoboy)

      motoboy
      |> track_cancel(order)
      |> make_unavailable!
    end)
  end

  defp insert_cancelation!(order, %{reason: reason}) when reason in [nil, ""] do
    order
  end

  defp insert_cancelation!(order, params) do
    location = order |> motoboy_current_location

    %OrderCancelation{}
    |> OrderCancelation.changeset(params)
    |> OrderCancelation.changeset(%{motoboy_id: order.motoboy_id})
    |> OrderCancelation.changeset(%{lat: location.lat})
    |> OrderCancelation.changeset(%{lng: location.lat})
    |> Repo.insert!()

    order
  end

  defp motoboy_current_location(%Order{motoboy_id: motoboy_id}) do
    from(
      mg in MotoboyGeolocation,
      where: mg.motoboy_id == ^motoboy_id,
      order_by: mg.inserted_at
    )
    |> last
    |> Repo.one()
  end

  defp send_to_new_motoboy_or_queue!(order, nil) do
    order
    |> send_to_queue!()
  end

  defp send_to_new_motoboy_or_queue!(order, new_motoboy) do
    order
    |> send_to_new_motoboy!(new_motoboy)
    |> track_sent_to_new_motoboy(new_motoboy)

    new_motoboy
    |> make_busy!
    |> track_my_new_order(order)
    |> Central.Shared.NotifyMotoboy.new_order()
  end

  defp send_to_queue!(order) do
    order
    |> track_sent_to_queue
    |> Order.changeset(%{
      state: Order.in_queue(),
      queued_at: order.inserted_at,
      motoboy_id: nil
    })
    |> Repo.update!()
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

  defp track_cancel(%Core.Motoboy{} = motoboy, %Core.Order{} = order) do
    Repo.insert(%History{
      scope: "motoboy",
      text: "Cancelou pedido",
      order_id: order.id,
      motoboy_id: motoboy.id
    })

    motoboy
  end

  defp track_cancel(%Core.Order{} = order, %Core.Motoboy{} = motoboy) do
    Repo.insert(%History{
      scope: "order",
      text: "Motoboy cancelou pedido",
      order_id: order.id,
      motoboy_id: motoboy.id
    })

    order
  end

  defp track_my_new_order(%Core.Motoboy{} = motoboy, %Order{} = order) do
    Repo.insert(%History{
      scope: "motoboy",
      text: "Recebeu pedido",
      order_id: order.id,
      motoboy_id: motoboy.id
    })

    motoboy
  end

  defp track_sent_to_new_motoboy(%Core.Order{} = order, %Core.Motoboy{} = motoboy) do
    Repo.insert(%History{
      scope: "order",
      text: "Pedido enviado a outro motoboy",
      order_id: order.id,
      motoboy_id: motoboy.id
    })

    order
  end

  defp track_sent_to_queue(%Order{} = order) do
    Repo.insert(%History{
      scope: "order",
      text: "Pedido cancelado e enviado para a fila. Aguardando o próximo motoboy disponível...",
      order_id: order.id
    })

    order
  end

  defp make_unavailable!(motoboy) do
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
