# https://documentation.onesignal.com/reference#create-notification

defmodule Api.OneSignal do
  use HTTPoison.Base

  def notify(player_id, message, data \\ %{}) do
    params = %{
      app_id: "f5474ff0-c010-4eca-ad1a-240b6e57ad16",
      contents: %{en: message},
      include_player_ids: [player_id],
      content_available: true,
      android_visibility: 1,
      priority: 10,
      # seconds
      ttl: 60,
      data: data
    }

    with {:ok, response} <- do_post("/notifications", params) do
      {:ok, response.body}
    end
  end

  def process_url(url) do
    "https://onesignal.com/api/v1" <> url
  end

  def process_response_body(body) do
    Poison.decode!(body)
  end

  defp do_post(path, params) do
    post(path, Poison.encode!(params), [
      {"Content-Type", "application/json"},
      {"Authorization", "Basic YmQzMjk3YjUtNTVhOC00Y2NjLWExMmItNzdkZDA3ZDBmNGMx"}
    ])
  end
end
