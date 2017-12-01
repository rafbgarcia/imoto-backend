defmodule Api.Guardian do
  use Guardian, otp_app: :api

  alias Db.Repo
  alias Core.{Central, Company, Motoboy}

  def subject_for_token(resource, _claims) do
    subject = to_string(resource.id)
    {:ok, subject}
  end
  def subject_for_token(_, _) do
    {:error, :reason_for_error}
  end

  def resource_from_claims(claims) do
    id = claims["sub"]

    resource = case claims["resource_type"] do
      "central" -> Repo.get(Central, id)
      "company" -> Repo.get(Company, id)
      "motoboy" -> Repo.get(Motoboy, id)
    end

    {:ok, resource}
  end
  def resource_from_claims(_claims) do
    {:error, :reason_for_error}
  end
end
