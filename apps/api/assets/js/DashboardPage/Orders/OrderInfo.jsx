import React from 'react'
import MotorcycleIcon from 'material-ui-icons/Motorcycle';
import AttachMoneyIcon from 'material-ui-icons/AttachMoney';
import PersonIcon from 'material-ui-icons/Person';
import PhoneIcon from 'material-ui-icons/Phone';

const OrderInfo = ({order}) => (
  <div className="mt-3 d-flex align-items-center justify-content-between">
    <div className="w-50 mr-3">
      <small className="mb-3 d-flex align-items-center">
        <PersonIcon className="mr-2" />
        <span>{order.customer.name}</span>
      </small>
      <small className="d-flex align-items-center">
        <PhoneIcon className="mr-2" />
        <span>{order.customer.phoneNumber}</span>
      </small>
    </div>
    <div className="w-50">
      <small className={`mb-3 d-flex align-items-center ${order.motoboy ? "" : "text-info"}`}>
        <MotorcycleIcon className="mr-2" />
        <span>{order.motoboy && order.motoboy.name || "O próximo disponível"}</span>
      </small>
      <small className="d-flex align-items-center">
        <AttachMoneyIcon className="mr-2" />
        <span>{order.formattedPrice}</span>
      </small>
    </div>
  </div>
)

export default OrderInfo
