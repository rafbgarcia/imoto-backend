defmodule Motoboy.Resolve.SendVerificationCode do
  use Api, :resolver

  def handle(%{phone_number: phone_number}, _) do
    with {:ok, _} <- find_motoboy(phone_number),
    {:ok, request_id} <- send_code(phone_number) do
      {:ok, %{request_id: request_id}}
    end
  end

  defp send_code(phone_number) do
    Motoboy.NexmoApi.start

    case Motoboy.NexmoApi.send_verification_code(phone_number) do
      {:ok, %{"status" => "0", "request_id" => request_id}} ->
        {:ok, request_id}
      {_, %{"error_text" => error}} ->
        {:error, error}
      _ ->
        {:error, "Tivemos um problema inesperado, por favor tente novamente"}
    end
  end

  defp find_motoboy(phone_number) do
    Repo.get_by(Core.Motoboy, phone_number: phone_number)
    |> case do
      nil -> {:error, "Número de telefone não encontrado"}
      motoboy -> {:ok, motoboy}
    end
  end
end
