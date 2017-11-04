import React from 'react'

export default class Orders extends React.Component {
  render() {
    return (
      <div>
        <h4>Novos Pedidos</h4>
        {this.orders()}
      </div>
    )
  }

  orders() {
    const {orders} = this.props
    return orders.map((order, i) => <Order key={i} order={order} />)
  }
}

class Order extends React.Component {
  render() {
    const {order} = this.props
    return (
      <section className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <span>{order.customer.name}</span>
          <span>{order.orderedAt}</span>
        </div>
      </section>
    )
  }
}
