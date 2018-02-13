import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'
import RemoveIcon from 'material-ui-icons/Remove'
import {Link} from 'react-router-dom'

import Orders from './Orders'
import Motoboys from './Motoboys'

class DashboardPage extends React.Component{
  state = {
    hasNewOrder: false,
    newOrderOpen: false,
  }

  componentWillMount() {
    this.props.data.refetch()
  }

  startStopPolling() {
    const {orders, loading} = this.props.data
    const {hasNewOrder} = this.state

    if (loading || !orders) return

    const hasPendingOrder = orders.some((order) => order.pending)

    if (hasNewOrder) {
      this.props.data.startPolling(2000)
      window.setTimeout(() => this.setState({hasNewOrder: false}), 3000)
    } else if (hasPendingOrder) {
      this.props.data.startPolling(2000)
    } else {
      // this.props.data.startPolling(10000)
      this.props.data.startPolling(3000)
    }
  }

  render() {
    const {data: {orders, motoboys, loading}} = this.props
    const {newOrderOpen} = this.state

    const hasMotoboysAvailable = motoboys && motoboys.some((motoboy) => motoboy.available)

    this.startStopPolling()

    return (
      <main>
        {
          !loading && (!motoboys || motoboys.length === 0) &&
          <NoMotoboysMessage />
        }


        <div className="row">
          <div className="col-md-9">
            <Orders orders={orders} />
          </div>
          <div className="col-md-3">
            <Motoboys motoboys={motoboys} />
          </div>
        </div>
      </main>
    )
  }
}

const NoMotoboysMessage = () => (
  <div className="mb-5 ">
    <div className="alert alert-warning">
      <h4>Comece a fazer entregas em 3 passos:</h4>
      1- Cadastre seus motoboys clicando em "Motoboys" no MENU ao lado.<br/>
      2- Os motoboys devem baixar a app do iMoto buscando por "iMoto Motoboys" na Play ou Apple store.<br/>
      3- Assim que eles ficarem disponíveis, você poderá enviar os pedidos.
    </div>
  </div>
)

export default graphql(gql`
  query getOrdersAndMotoboys {
    orders {
      id
      formattedPrice
      pending
      confirmed
      finished
      inQueue
      insertedAt
      confirmedAt
      finishedAt
      queuedAt
      stops {
        sequence
        instructions
        reference line1
      }
      customer { id name phoneNumber}
      motoboy { id name }
    }

    motoboys {
      id
      name
      available
      busy
      unavailable
      becameAvailableAt
      becameUnavailableAt
      becameBusyAt
    }
  }
`)((props) => <DashboardPage {...props} />)
