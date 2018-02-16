defmodule Central.Resolve.CreateOrder do
  use Api, :resolver
  alias Core.{CentralCustomer, Motoboy, Order, History}

  def handle(%{params: params, motoboy_id: motoboy_id}, %{context: %{current_central: central}}) do
    with {:ok, _} <- ensure_my_customer(params.central_customer_id, central.id) do
      Repo.transaction(fn ->
        case send_or_enqueue_order(params, central.id, motoboy_id) do
          {:ok, order} -> order
          {:error, message} -> Repo.rollback(message)
        end
      end)
    end
  end

  def handle(_, _) do
    {:error, "Algo deu errado, por favor refaça login e tente novamente"}
  end

  defp send_or_enqueue_order(params, central_id, "next_in_queue") do
    case next_available_motoboy(central_id) do
      nil -> create_order_in_queue(params, central_id, nil)
      motoboy -> create_pending_order(params, motoboy, central_id)
    end
  end

  defp send_or_enqueue_order(params, central_id, motoboy_id) do
    with {:ok, motoboy} <- get_motoboy(motoboy_id, central_id) do
      unavailable = Motoboy.unavailable()

      case motoboy.state do
        ^unavailable -> {:error, "Este motoboy está offline, pedido não enviado"}
        _ -> create_pending_order(params, motoboy, central_id)
      end
    end
  end

  defp create_order_in_queue(params, central_id, motoboy_id) do
    {:ok, order} =
      create_order(
        Map.merge(params, %{
          state: Order.in_queue(),
          queued_at: Timex.local(),
          motoboy_id: motoboy_id,
          central_id: central_id
        })
      )

    add_order_in_queue_to_history(order.id)
    {:ok, order}
  end

  defp create_pending_order(params, motoboy, central_id) do
    make_motoboy_busy!(motoboy)

    {:ok, order} =
      create_order(
        Map.merge(params, %{
          state: Order.pending(),
          motoboy_id: motoboy.id,
          central_id: central_id
        })
      )

    Central.Shared.NotifyMotoboy.new_order(motoboy.one_signal_player_id)
    add_order_pending_to_history(order.id, motoboy.id)
    {:ok, order}
  end

  defp get_motoboy(motoboy_id, central_id) do
    motoboy = Repo.get_by(Motoboy, id: motoboy_id, central_id: central_id)

    case motoboy do
      nil ->
        {:error,
         "Estranho, este motoboy não está cadastrado, entre em contato com o suporte técnico"}

      %{active: active} when active == false ->
        {:error, "Este motoboy está INATIVO. Ative-o para enviar um pedido"}

      motoboy ->
        {:ok, motoboy}
    end
  end

  defp ensure_my_customer(customer_id, central_id) do
    from(
      c in CentralCustomer,
      where: c.id == ^customer_id,
      where: c.central_id == ^central_id
    )
    |> Repo.one()
    |> case do
      nil -> {:error, "Cliente não encontrado"}
      customer -> {:ok, customer}
    end
  end

  defp create_order(params) do
    %Order{}
    |> Order.changeset(Map.merge(params, %{sent_at: Timex.local}))
    |> Repo.insert()
  end

  defp next_available_motoboy(central_id) do
    from(
      m in Motoboy,
      lock: "FOR UPDATE",
      where: m.state == ^Motoboy.available(),
      where: m.central_id == ^central_id,
      where: m.active == ^true,
      order_by: m.became_available_at
    )
    |> first
    |> Repo.one()
  end

  defp make_motoboy_busy!(motoboy) do
    motoboy
    |> Motoboy.changeset(%{state: Motoboy.busy(), became_busy_at: Timex.local()})
    |> Repo.update!()
  end

  defp add_order_pending_to_history(order_id, motoboy_id) do
    Repo.insert(%History{
      scope: "motoboy",
      text: "Recebeu pedido",
      order_id: order_id,
      motoboy_id: motoboy_id
    })

    Repo.insert(%History{
      scope: "order",
      text: "Pedido enviado para o motoboy",
      order_id: order_id,
      motoboy_id: motoboy_id
    })
  end

  defp add_order_in_queue_to_history(order_id) do
    Repo.insert(%History{
      scope: "order",
      text: "Nenhum motoboy disponível, pedido enviado para a fila.",
      order_id: order_id
    })
  end
end
