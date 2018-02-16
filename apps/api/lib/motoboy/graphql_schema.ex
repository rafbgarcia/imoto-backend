defmodule Motoboy.GraphqlSchema do
  use Absinthe.Schema
  import_types(Graphql.Types)

  query do
    field(:myself, :motoboy, resolve: &Motoboy.Resolve.MyData.myself/2)
    field(:ongoing_orders, list_of(:order), resolve: &Motoboy.Resolve.OngoingOrders.handle/2)
  end

  mutation do
    field :request_code, :verification_response do
      arg(:phone_number, non_null(:string))
      resolve(&Motoboy.Resolve.SendVerificationCode.handle/2)
    end

    field :verify_code, :motoboy do
      arg(:params, :verify_code_params)
      resolve(&Motoboy.Resolve.VerifyCode.handle/2)
    end

    field :update_player_id, :motoboy do
      arg(:player_id, non_null(:string))
      resolve(&Motoboy.Resolve.UpdatePlayerId.handle/2)
    end

    field(:make_motoboy_available, :motoboy, resolve: &Motoboy.Resolve.MakeAvailable.handle/2)
    field(:make_motoboy_unavailable, :motoboy, resolve: &Motoboy.Resolve.MakeUnavailable.handle/2)

    field :confirm_order, :order do
      arg(:order_id, non_null(:id))
      resolve(&Motoboy.Resolve.ConfirmOrder.handle/2)
    end

    field :cancel_order, :motoboy do
      arg(:params, :cancel_order_params)
      resolve(&Motoboy.Resolve.CancelOrder.handle/2)
    end

    field :finish_order, :order do
      arg(:order_id, non_null(:id))
      resolve(&Motoboy.Resolve.FinishOrder.handle/2)
    end

    @doc """
    Check the queue and assigns an order to the motoboy, if there is one
    """
    field(:next_order_in_queue, :order, resolve: &Motoboy.Resolve.NextOrderInQueue.handle/2)

    field :track_location, :motoboy_geolocation do
      arg(:params, :location_params)
      resolve(&Motoboy.Resolve.TrackLocation.handle/2)
    end
  end

  input_object :cancel_order_params do
    field(:order_id, non_null(:id))
    field(:reason, :string)
    field(:has_order_in_hands, :boolean)
  end

  input_object :location_params do
    field(:lat, :string)
    field(:lng, :string)
  end

  input_object :verify_code_params do
    field(:request_id, non_null(:string))
    field(:code, non_null(:string))
    field(:phone_number, non_null(:string))
  end

  object :verification_response do
    field(:request_id, non_null(:string))
  end
end
