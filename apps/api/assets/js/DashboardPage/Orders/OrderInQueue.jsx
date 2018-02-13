import React from 'react'
import Moment from 'react-moment';
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'
import { CircularProgress } from 'material-ui/Progress'
import 'moment/locale/pt-br';

import OrderInfo from "./OrderInfo"

export default class OrderInQueue extends React.Component {
  render() {
    const {order} = this.props

    return (
      <div className="col-md-6 mb-4">
        <Paper elevation={3} className="pt-2 pb-2 pl-3 pr-3">
          <header className="text-center text-muted">
            <span>Pedido #{order.id}</span>
            <br />
            <small>Na fila desde às <Moment format="HH:mm\h">{order.queuedAt}</Moment></small>
          </header>

          <hr className="mt-2 mb-2" />

          <OrderInfo order={order} />

          {/*<div className="d-flex align-items-center justify-content-between pt-3 pb-1">
            <Tooltip title="Mudar o motoboy deste pedido" className="w-50 mr-3">
              <Button fullWidth variant="raised" size="small">Mudar motoboy</Button>
            </Tooltip>
            <Tooltip title="Cancelar este pedido" className="w-50">
              <Button fullWidth variant="raised" size="small">Cancelar pedido</Button>
            </Tooltip>
          </div>*/}
        </Paper>
      </div>
    )
  }
}
