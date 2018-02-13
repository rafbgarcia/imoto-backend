defmodule Motoboy.Resolve.MyData do
  use Api, :resolver

  alias Core.{Order}

  def myself(_, %{context: %{current_motoboy: motoboy}}) do
    {:ok, motoboy}
  end

  def current_order(_, %{context: %{current_motoboy: motoboy}}) do
    {:ok, current_order(motoboy.id)}
  end
  defp current_order(motoboy_id) do
    from(
      o in Order,
      where: o.motoboy_id == ^motoboy_id,
      where: o.state in [^Order.pending(), ^Order.confirmed()]
    )
    |> first
    |> Repo.one()
  end

  def first_name(motoboy, _args, _ctx) do
    first_name = motoboy.name |> String.split(" ") |> Enum.at(0)
    {:ok, first_name}
  end

  def available(%{state: state}, _args, _ctx) do
    {:ok, state == Core.Motoboy.available()}
  end

  def unavailable(%{state: state}, _args, _ctx) do
    {:ok, state == Core.Motoboy.unavailable()}
  end

  def confirming_order(%{state: state}, _args, _ctx) do
    {:ok, state == Core.Motoboy.confirming_order()}
  end

  def busy(%{state: state}, _args, _ctx) do
    {:ok, state == Core.Motoboy.busy()}
  end
end
