import React from 'react'
import Moment from 'react-moment'
import Paper from 'material-ui/Paper'

import OrderInfo from "./OrderInfo"

export default class PendingOrder extends React.Component {
  render() {
    const {order} = this.props

    return (
      <div className="col-md-6 mb-4">
        <Paper elevation={1} className="pt-2 pb-2 pl-3 pr-3">
          <header className="text-muted">
            Pedido #{order.id}
            <br />
            <small>Confirmado <Moment fromNow>{order.insertedAt}</Moment></small>
          </header>

          <hr className="mt-2 mb-2" />

          <OrderInfo order={order} />
        </Paper>
      </div>
    )
  }
}
