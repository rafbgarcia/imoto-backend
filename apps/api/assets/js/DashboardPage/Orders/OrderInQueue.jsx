import React from 'react'
import Moment from 'react-moment';
import Paper from 'material-ui/Paper'
import { CircularProgress } from 'material-ui/Progress'
import 'moment/locale/pt-br';

import OrderInfo from "./OrderInfo"

export default class OrderInQueue extends React.Component {
  render() {
    const {order} = this.props

    return (
      <div className="col-md-6 mb-4">
        <Paper elevation={1} className="pt-2 pb-2 pl-3 pr-3">
          <header className="text-muted">
            <div>
              Pedido #{order.id}
              <br />
              <small>
                Na fila desde às <Moment format="HH:mm\h">{order.queuedAt}</Moment>
              </small>
            </div>
          </header>
          <hr className="mt-2 mb-2" />

          <OrderInfo order={order} />
        </Paper>
      </div>
    )
  }
}
