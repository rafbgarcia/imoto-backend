defmodule Motoboy.Resolve.VerifyCode do
  use Api, :resolver

  def handle(%{params: params}, _) do
    %{
      request_id: request_id,
      code: code,
      phone_number: phone_number
    } = params

    with {:ok, motoboy} <- find_motoboy(phone_number),
         {:ok, _} <- verify_code(request_id, code),
         {:ok, jwt, _} <- Api.Guardian.encode_and_sign(motoboy, %{resource_type: :motoboy}) do
      {:ok, Map.put(motoboy, :token, jwt)}
    end
  end

  defp verify_code(request_id, code) do
    Motoboy.NexmoApi.start()

    case Motoboy.NexmoApi.verify_code(request_id, code) do
      {:ok, %{"status" => "0"}} ->
        {:ok, "Telefone verificado."}

      {:ok, %{"status" => "6"}} ->
        {:error, "Sua verificação expirou. Volte a página e peça outro código."}

      {:ok, %{"status" => "16"}} ->
        {:error, "O código informado está incorreto."}

      {:ok, %{"status" => "17"}} ->
        {:error, "Você excedeu o limite de tentativas, por favor volte e tente novamente."}

      {:ok, %{"status" => "19"}} ->
        {:error, "Sua verificação expirou. Volte a página e peça outro código."}

      {:ok, %{"status" => "101"}} ->
        {:error, "Sua verificação expirou. Volte a página e peça outro código."}

      {_, %{"error_text" => error}} ->
        {:error, error}

      _ ->
        {:error, "Seu celular não pôde ser verificado, por favor tente novamente"}
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
