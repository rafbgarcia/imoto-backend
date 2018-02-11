defmodule Central.Resolve.MyCompanies do
  use Api, :resolver

  alias Core.{Company}

  def handle(_args, %{context: %{current_central: current_central}}) do
    {:ok, all(current_central.id)}
  end

  defp all(central_id) do
    from(
      c in Company,
      where: c.central_id == ^central_id,
      order_by: c.name
    )
    |> Repo.all()
  end
end
