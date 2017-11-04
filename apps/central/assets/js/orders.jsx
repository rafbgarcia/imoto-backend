import ReactDOM from 'react-dom'
import React from 'react'
import axios from 'axios'

class OrdersContainer extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      orders: [],
      motoboys: [],
    }
  }

  query() {
    return `query getOrdersAndMotoboys {
      orders {
        id
        state
        price
        insertedAt
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
        state
        lastAvailableAt
        lastBusyAt
      }
    }`
  }

  componentDidMount() {
    axios.get(`/api/graphql?query=${this.query()}`)
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
          <Orders orders="this.state.orders" />
        </div>
        <div className="col-sm-4">
          <Motoboys motoboys="this.state.motoboys" />
        </div>
      </div>
    )
  }
}

class Orders extends React.Component {
  render() {
    return (
      <div>
        <h4>Novos Pedidos</h4>

      </div>
    )
  }
}

class Motoboys extends React.Component {
  render() {
    return (
      <div>
        <h4>Motoboys</h4>
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<OrdersContainer />, document.querySelector('#orders'))
})
