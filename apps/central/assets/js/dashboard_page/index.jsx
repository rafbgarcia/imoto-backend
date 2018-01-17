import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'
import {Link} from 'react-router-dom'
import MenuIcon from 'material-ui-icons/Menu';

import Orders from './orders'
import Motoboys from './motoboys'
import NewOrderModal from './new_order_modal'

class DashboardPage extends React.Component{
  state = {
    modalOpen: false,
    hasNewOrder: true,
  }

  startStopPolling() {
    const {orders, loading} = this.props.data
    const {hasNewOrder} = this.state

    if (loading || !orders) return

    const hasPendingOrder = orders.some((order) => order.pending)
    const hasOngoingOrder = orders.some((order) => order.confirmed)

    if (hasNewOrder) {
      this.props.data.startPolling(2000)
      window.setTimeout(() => this.setState({hasNewOrder: false}), 3000)
    } else if (hasPendingOrder) {
      this.props.data.startPolling(2000)
    } else if (hasOngoingOrder) {
      this.props.data.startPolling(30000)
    } else {
      this.props.data.stopPolling()
    }
  }

  onCloseNewOrderModal = () => {
    const {startPolling} = this.props.data
    this.setState({modalOpen: false})

    setTimeout(() => {
      startPolling(2000)
    }, 1000)
  }

  render() {
    const {orders, motoboys} = this.props.data
    const {modalOpen} = this.state

    this.startStopPolling()

    return (
      <main>
        {
          !motoboys || motoboys.length === 0 ?
          <NoMotoboysMessage />
          :
          <div className="mb-5">
            <Button raised color="primary" onClick={() => this.setState({modalOpen: true})}>
              <AddIcon className="mr-2" /> Nova entrega
            </Button>
            <NewOrderModal open={modalOpen} onClose={this.onCloseNewOrderModal} />
          </div>
        }

        <div className="row">
          <div className="col-sm-3">
            <Motoboys motoboys={motoboys} />
          </div>
          <div className="col-sm-9">
            <Orders orders={orders} />
          </div>
        </div>
      </main>
    )
  }
}

export default graphql(gql`
  query getOrdersAndMotoboys {
    orders {
      id
      formattedPrice
      pending
      confirmed
      noMotoboy
      finished
      insertedAt
      confirmedAt
      finishedAt
      stops {
        sequence
        instructions
        location { name reference line1 }
      }
      customer { id name phoneNumber }
      company { id name phoneNumber}
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

const NoMotoboysMessage = () => (
  <div className="mb-5">
    <p>Para começar a enviar pedidos, cadastre seus motoboys</p>
    <p>Clique no icone <Button raised dense color="primary"><MenuIcon /></Button> e depois em "Motoboys"</p>
  </div>
)
