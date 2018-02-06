defmodule Motoboy.SharedFunctions do
  use Api, :resolver

  alias Core.{Order}

  def get_order!(order_id, motoboy_id) do
    from(o in Order,
      where: o.id == ^order_id,
      where: o.motoboy_id == ^motoboy_id
    )
    |> first
    |> Repo.one!
  end
end
