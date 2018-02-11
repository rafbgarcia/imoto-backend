# API: https://developer.nexmo.com/api/verify#request-4

defmodule Motoboy.NexmoApi do
  use HTTPoison.Base

  def send_verification_code(phone_number) do
    params = %{
      api_key: "9b89aa7e",
      api_secret: "5000b71f741c8cae",
      number: format_number(phone_number),
      country: "BR",
      brand: "iMoto",
      pin_expiry: 60,
      next_event_wait: 60
    }

    with {:ok, response} <- do_post("/verify/json", params) do
      {:ok, response.body}
    end
  end

  def verify_code(request_id, code) do
    params = %{
      api_key: "9b89aa7e",
      api_secret: "5000b71f741c8cae",
      request_id: request_id,
      code: code
    }

    with {:ok, response} <- do_post("/verify/check/json", params) do
      {:ok, response.body}
    end
  end

  def process_url(url) do
    "https://api.nexmo.com" <> url
  end

  def process_response_body(body) do
    Poison.decode!(body)
  end

  defp format_number(phone_number) do
    String.replace(phone_number, ~r/[^\d]/, "")
  end

  defp do_post(path, params) do
    post(path, Poison.encode!(params), [{"Content-Type", "application/json"}])
  end
end
