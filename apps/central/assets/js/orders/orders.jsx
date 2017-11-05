import React from 'react'
import graphql from 'js/graphql'
import PendingOrder from './pending_order'
import ConfirmedOrder from './confirmed_order'

export default class Orders extends React.Component {
  state = {
    pendingOrders: [],
    confirmedOrders: [],
    showMotoboys: false,
  }

  componentDidMount() {
    graphql.run(query())
      .then((data) => {
        const pendingOrders = data.orders.filter((order) => order.pending)
        const confirmedOrders = data.orders.filter((order) => order.confirmed)
        this.setState({ pendingOrders, confirmedOrders })
      })
  }

  moveOrderToConfirmedQueue(order) {
    const {pendingOrders, confirmedOrders} = this.state

    order.pending = false
    order.confirmed = true

    const newPendingOrders = pendingOrders.filter((aOrder) => aOrder.id != order.id)
    confirmedOrders.push(order)

    this.setState({pendingOrders: newPendingOrders})
  }

  onConfirm = (order, cb) => {
    // this.moveOrderToConfirmedQueue(order)

    graphql.run(confirmOrderMutation(order.id))
    .then((data) => {
      cb()
      if (data.order.error) {
        alert(data.order.error)
      } else {
        const {pendingOrders, confirmedOrders} = this.state
        const newPendingOrders = pendingOrders.filter((aOrder) => aOrder.id != data.order.id)
        confirmedOrders.push(data.order)
        this.setState({pendingOrders: newPendingOrders})
      }
    })
  }

  onCancel = (order, cb) => {
    graphql.run(cancelOrderMutation(order.id))
    .then((data) => {
      cb()

      if (data.order.error) {
        alert(data.order.error)
      } else {
        const {pendingOrders} = this.state
        this.setState({ pendingOrders: pendingOrders.filter((aOrder) => aOrder.id != order.id) })
      }
    })
  }

  pending() {
    const {pendingOrders} = this.state

    return pendingOrders.map((order, i) =>
      <PendingOrder
        key={i}
        order={order}
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
        />
    )
  }

  confirmed() {
    const {confirmedOrders} = this.state
    return confirmedOrders.map((order, i) =>
      <ConfirmedOrder key={i} order={order} />
    )
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-6">
          <h4>Novos Pedidos</h4>
          {this.pending()}
        </div>
        <div className="col-sm-6">
          <h4>Pedidos em entrega</h4>
          {this.confirmed()}
        </div>
      </div>
    )
  }
}

function query() {
  return `query getOrders {
    orders {
      id
      formattedPrice
      pending
      confirmed
      insertedAt
      confirmedAt
      stops {
        sequence
        instructions
        location { reference, line1 }
      }
      customer { name, phoneNumber }
      motoboy { name }
    }
  }`
}

function confirmOrderMutation(orderId) {
  return `mutation confirmOrder {
    order: confirmOrder(orderId: ${orderId}) {
      ... on Order {
        id
        formattedPrice
        pending
        confirmed
        insertedAt
        confirmedAt
        stops {
          sequence
          instructions
          location { reference, line1 }
        }
        customer { name, phoneNumber }
        motoboy { name }
      }

      ... on Error {
        error
      }
    }
  }`
}

function cancelOrderMutation(orderId) {
  return `mutation cancelOrder {
    order: cancelOrder(orderId: ${orderId}) {
      ... on Error {
        error
      }
    }
  }`
}
