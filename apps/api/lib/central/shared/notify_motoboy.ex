defmodule Central.Shared.NotifyMotoboy do
  alias Core.Motoboy

  def new_order(%Motoboy{one_signal_player_id: player_id}) do
    notify(
      player_id,
      "Abra o aplicativo para confirmar em até 2 minutos",
      %{headings: %{en: "Nova entrega!"}}
    )
  end

  def order_auto_canceled(%Motoboy{one_signal_player_id: player_id}) do
    notify(
      player_id,
      "Pedido voltou para a fila, você agora está offline. Fique online quando puder fazer entregas",
      %{headings: %{en: "Cancelamento automático"}}
    )
  end

  def notify(player_id, message, data \\ %{}) do
    Task.start(Api.OneSignal, :notify, [player_id, message, data])
  end
end
