import React from 'react'
import PendingOrder from './pending_order'
import axios from 'axios'
import Motoboys from './motoboys'

export default class Orders extends React.Component {
  state = {
    pendingOrders: [],
    confirmedOrders: [],
    showMotoboys: false,
  }

  componentDidMount() {
    axios.post(`/api/graphql?query=${query()}`)
      .then((res) => {
        const pendingOrders = res.data.data.orders.filter((order) => order.pending)
        const confirmedOrders = res.data.data.orders.filter((order) => order.confirmed)
        this.setState({ pendingOrders, confirmedOrders })
      })
  }

  onConfirm = (order) => {
    const {pendingOrders, confirmedOrders} = this.state

    order.pending = false
    order.confirmed = true

    const newPendingOrders = pendingOrders.filter((order) => order.id != id)
    confirmedOrders.push(order)

    this.setState({pendingOrders: newPendingOrders})
  }

  onCancel = (order) => {
    const {pendingOrders, confirmedOrders} = this.state

    if (order.pending) {
      order.pending = false
      this.setState({ pendingOrders: pendingOrders.filter((order) => order.id != id) })
    } else if (order.confirmed) {
      order.confirmed = false
      this.setState({ confirmedOrders: confirmedOrders.filter((order) => order.id != id) })
    }
    axios.post()
  }

  pending() {
    const {pendingOrders} = this.state

    return pendingOrders.map((order, i) =>
      order.pending &&
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
      order.confirmed && <PendingOrder key={i} order={order} />
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

        <Motoboys showMotoboys={this.state.showMotoboys} />
      </div>
    )
  }
}

function query() {
  return `query getOrdersAndMotoboys {
    orders {
      id
      price
      pending
      confirmed
      orderedAt
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
