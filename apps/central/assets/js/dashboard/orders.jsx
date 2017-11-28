import React from 'react'
import PendingOrder from './pending_order'
import ConfirmedOrder from './confirmed_order'
import FinishedOrder from './finished_order'
import ListSubheader from 'material-ui/List/ListSubheader'
import Divider from 'material-ui/Divider'

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

  finishedAndCanceledData(orders) {
    const finished = orders.filter((order) => order.finished).length
    const noMotoboy = orders.filter((order) => order.noMotoboy).length

    return [
      {name: 'Finalizadas', value: finished},
      {name: 'Sem motoboy', value: noMotoboy},
    ]
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
    const data = this.finishedAndCanceledData(orders)
    const COLORS = ['#00C49F', '#FFBB28']

    return (
      <div className="row">
        <div className="col-sm-4">
          <ListSubheader>Aguardando motoboy</ListSubheader>
          {this.pending(orders)}
        </div>
        <div className="col-sm-5">
          <ListSubheader>Em entrega</ListSubheader>
          {this.confirmed(orders)}
        </div>
        <div className="col-sm-3">
          <ListSubheader>Finalizadas</ListSubheader>
          {this.finished(orders)}
        </div>
      </div>
    )
  }
}
