import React from 'react'
import Moment from 'react-moment';
import Paper from 'material-ui/Paper'
import PersonIcon from 'material-ui-icons/Person'
import PhoneIcon from 'material-ui-icons/Phone'
import MotorcycleIcon from 'material-ui-icons/Motorcycle'
import AttachMoneyIcon from 'material-ui-icons/AttachMoney'
import { CircularProgress } from 'material-ui/Progress'
import 'moment/locale/pt-br';

export default class OrderInQueue extends React.Component {
  render() {
    const {order} = this.props

    return (
      <div className="col-md-6 mb-4">
        <Paper elevation={1} className="pt-2 pb-2 pl-3 pr-3">
          <header className="text-muted" style={{borderBottom: "1px solid #ddd", paddingBottom: ".5rem"}}>
            Pedido #{order.id}
            <br />
            <small>
              Na fila desde às <Moment format="HH:mm\h">{order.queuedAt}</Moment>
            </small>
          </header>

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
        </Paper>
      </div>
    )
  }
}
