import React from 'react'
import PendingOrder from './pending_order'
import ConfirmedOrder from './confirmed_order'
import FinishedOrder from './finished_order'
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

export default class Orders extends React.Component {
  pending(orders) {
    const pendingOrders = orders.filter((order) => order.pending)

    return pendingOrders.map((order, i) =>
      <PendingOrder key={i} order={order} />
    )
  }

  confirmed(orders) {
    const confirmedOrders = orders.filter((order) => order.confirmed)
    return confirmedOrders.map((order, i) =>
      <ConfirmedOrder key={i} order={order} />
    )
  }

  countFinished(orders) {
    return orders.filter((order) => order.finished).length
  }

  finished(orders) {
    const finishedOrders = orders.filter((order) => order.finished)
    return finishedOrders.map((order, i) =>
      <FinishedOrder key={i} order={order} />
    )
  }

  render() {
    const {orders} = this.props
    if (!orders) return null

    return (
      <div className="row">
        <div className="col-sm-4">
          <div>
            <Subheader>Aguardando motoboy</Subheader>
            {this.pending(orders)}
          </div>
        </div>
        <div className="col-sm-5">
          <div>
            <Subheader>Em entrega</Subheader>
            {this.confirmed(orders)}
          </div>
        </div>
        <div className="col-sm-3">
          <div>
            <Subheader>Entregues</Subheader>
            {this.countFinished(orders)}
          </div>
        </div>
      </div>
    )
  }
}
