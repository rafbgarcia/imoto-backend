import React from 'react'

export default class Orders extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-sm-6">
          <h4>Novos Pedidos</h4>
          {this.pendingOrders()}
        </div>
        <div className="col-sm-6">
          <h4>Pedidos em entrega</h4>
          {this.confirmedOrders()}
        </div>
      </div>
    )
  }

  pendingOrders() {
    const {orders} = this.props
    return orders.map((order, i) => order.pending && <Order key={i} order={order} />)
  }

  confirmedOrders() {
    const {orders} = this.props
    return orders.map((order, i) => order.confirmed && <Order key={i} order={order} />)
  }
}

class Order extends React.Component {
  render() {
    const {order} = this.props
    return (
      <section className="card mb-3">
        <div className="card-header d-flex align-items-center justify-content-between">
          <span>#{order.id}</span>
          <span>{order.orderedAt}</span>
        </div>
        <div className="card-body">
          {this.stops(order.stops)}
        </div>
      </section>
    )
  }

  stops(stops) {
    return stops.map((stop, i) => <Stop key={i} stop={stop} />)
  }
}

class Stop extends React.Component {
  render() {
    return (
      <div></div>
    )
  }
}
