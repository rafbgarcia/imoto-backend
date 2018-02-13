defmodule Central.Shared.NotifyMotoboy do

  def new_order(player_id, message \\ "Você tem uma nova entrega!") do
    Task.start(Api.OneSignal, :notify, [player_id, message])
  end

end
