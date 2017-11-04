import React from 'react'
import axios from 'axios'
import Motoboys from './motoboys'
import Orders from './orders'

export default class OrdersContainer extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      orders: [],
      motoboys: [],
    }
  }

  componentDidMount() {
    axios.get(`/api/graphql?query=${query()}`)
      .then((res) => {
        const orders = res.data.data.orders
        const motoboys = res.data.data.motoboys
        this.setState({ orders, motoboys })
      })
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-8">
          <Orders orders={this.state.orders} />
        </div>
        <div className="col-sm-4">
          <Motoboys motoboys={this.state.motoboys} />
        </div>
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
        location { reference, line1 }
      }
      customer { name, phoneNumber }
      motoboy { name }
    }

    motoboys {
      name
      available, busy, unavailable
      lastAvailableAt, lastBusyAt
    }
  }`
}
