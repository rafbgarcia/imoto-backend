import React from 'react'
import Timeago from 'js/timeago'
import Paper from 'material-ui/Paper'
import PersonIcon from 'material-ui-icons/Person'
import PhoneIcon from 'material-ui-icons/Phone'
import MotorcycleIcon from 'material-ui-icons/Motorcycle'
import AttachMoneyIcon from 'material-ui-icons/AttachMoney'
import { CircularProgress } from 'material-ui/Progress'

export default class PendingOrder extends React.Component {
  render() {
    const {order} = this.props

    return (
      <Paper elevation={1} className="mb-3 pt-2 pb-2 pl-3 pr-3">
        <header className="text-center text-muted" style={{borderBottom: "1px solid #ddd", paddingBottom: ".5rem"}}>
          Pedido #{order.id}
        </header>

        <div className="mt-3">
          <div className="mb-3">
            <small className="text-muted">Enviado <Timeago date={order.insertedAt} /></small>
          </div>
          <div className="mb-3 d-flex align-items-center">
            <PersonIcon className="mr-2" />
            <span>{order.customer.name}</span>
          </div>
          <div className="mb-3 d-flex align-items-center">
            <PhoneIcon className="mr-2" />
            <span>{order.customer.phoneNumber}</span>
          </div>
          <div className="mb-3 d-flex align-items-center">
            <MotorcycleIcon className="mr-2" />
            <span>{order.motoboy.name}</span>
          </div>
          <div className="d-flex align-items-center">
            <AttachMoneyIcon className="mr-2" />
            <span>{order.formattedPrice}</span>
          </div>
        </div>

        <div className="mt-3 mb-2 d-flex align-items-center justify-content-center">
          <CircularProgress size={20} />
          <span className="ml-2 text-muted">Aguardando confirmação...</span>
        </div>
      </Paper>
    )
  }
}
