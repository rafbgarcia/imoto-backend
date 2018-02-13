import React from 'react'
import ListSubheader from 'material-ui/List/ListSubheader'
import Divider from 'material-ui/Divider'

import PendingOrder from './PendingOrder'
import ConfirmedOrder from './ConfirmedOrder'
import FinishedOrder from './FinishedOrder'
import OrderInQueue from './OrderInQueue'

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

  finished(orders) {
    const finishedOrders = orders.filter((order) => order.finished)
    return finishedOrders.map((order, i) =>
      <FinishedOrder key={i} order={order} />
    )
  }

  inQueue(orders) {
    const ordersInQueue = orders.filter((order) => order.inQueue)
    return ordersInQueue.map((order, i) =>
      <OrderInQueue key={i} order={order} />
    )
  }

  render() {
    const {orders} = this.props
    if (!orders) return null

    const ordersInQueue = this.inQueue(orders)
    const pendingOrders = this.pending(orders)
    const confirmedOrders = this.confirmed(orders)
    const finishedOrders = this.finished(orders)

    return (
      <section>
        <div className="mb-5">
          <h5 className="text-muted mb-3">
            <span className="mr-2">Pedidos na fila</span>
            <span className="badge badge-info">{ordersInQueue.length}</span>
          </h5>
          <div className="row">
            {ordersInQueue}
          </div>
        </div>

        <div className="mb-5">
          <h5 className="text-muted mb-3">
            <span className="mr-2">Pedidos aguardando confirmação do motoboy</span>
            <span className="badge badge-info">{pendingOrders.length}</span>
          </h5>
          <div className="row">
            {pendingOrders}
          </div>
        </div>

        <div className="mb-5">
          <h5 className="text-muted mb-3">
            <span className="mr-2">Pedidos em entrega</span>
            <span className="badge badge-info">{confirmedOrders.length}</span>
          </h5>
          <div className="row">
            {confirmedOrders}
          </div>
        </div>

        <div>
          <h5 className="text-muted mb-3">
            <span className="mr-2">Pedidos finalizados</span>
            <span className="badge badge-info">{finishedOrders.length}</span>
          </h5>
          <div className="row">
            {finishedOrders}
          </div>
        </div>
      </section>
    )
  }
}
