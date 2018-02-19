defmodule Central.Shared.NotifyMotoboy do
  def new_order(player_id, message \\ "Você tem uma nova entrega!")

  def new_order(%Core.Motoboy{one_signal_player_id: player_id}, message) do
    new_order(player_id, message)
  end

  def new_order(player_id, message) do
    Task.start(Api.OneSignal, :notify, [player_id, message])
  end
end
