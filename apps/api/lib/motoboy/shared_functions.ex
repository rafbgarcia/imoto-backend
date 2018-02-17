defmodule Motoboy.SharedFunctions do
  use Api, :resolver

  alias Core.{Order}

  def get_order!(order_id, motoboy_id) do
    from(
      o in Order,
      where: o.id == ^order_id,
      where: o.motoboy_id == ^motoboy_id
    )
    |> first
    |> Repo.one!()
  end

  def ongoing_orders(%Core.Motoboy{id: id}) do
    from(
      o in Order,
      where: o.motoboy_id == ^id,
      where: o.state in [^Order.pending(), ^Order.confirmed()],
      order_by: o.inserted_at
    )
    |> Repo.all()
  end

  def has_ongoing_orders(%Core.Motoboy{id: id}) do
    count = from(
      o in Order,
      where: o.motoboy_id == ^id,
      where: o.state in [^Order.pending(), ^Order.confirmed()],
      order_by: o.inserted_at
    )
    |> Repo.aggregate(:count, :id)

    count > 0
  end
end
