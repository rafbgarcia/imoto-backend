# API: https://developer.nexmo.com/api/verify#request-4

defmodule Motoboy.NexmoApi do
  use HTTPoison.Base

  def send_verification_code(phone_number) do
    params = %{
      number: format_number(phone_number),
      country: "BR",
      brand: "iMoto",
      pin_expiry: 300,
      next_event_wait: 60,
    }

    with {:ok, response} <- post("/verify/json", params) do
      {:ok, response.body}
    end
  end

  def verify_code(request_id, code) do
    params = %{
      request_id: request_id,
      code: code,
    }

    with {:ok, response} <- post("/verify/check/json", params) do
      {:ok, response.body}
    end
  end

  # def find_verification(request_id) do
  #   with {:ok, response} <- post("/verify/search/json", %{request_id: request_id}) do
  #     {:ok, response.body}
  #   end
  # end

  def process_url(url) do
    "https://api.nexmo.com" <> url
  end

  def process_response_body(body) do
    body
    |> Poison.decode!
    # |> Map.take(["status", "request_id", "status", "error_text"])
    |> Enum.map(fn({k, v}) -> {String.to_atom(k), v} end)
  end

  defp format_number(phone_number) do
    String.replace(phone_number, ~r/[^\d]/, "")
  end
end
