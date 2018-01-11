import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'

import Orders from './orders'
import Motoboys from './motoboys'
import NewOrderModal from './new_order_modal'

class DashboardPage extends React.Component{
  state = {
    modalOpen: false,
  }

  startStopPolling() {
    const {orders, loading} = this.props.data

    if (loading) return

    const hasPendingOrder = orders.some((order) => order.pending)
    const hasOngoingOrder = orders.some((order) => order.confirmed)

    if (hasPendingOrder) {
      this.props.data.startPolling(2000)
    } else if (hasOngoingOrder) {
      this.props.data.startPolling(30000)
    } else {
      this.props.data.stopPolling()
    }
  }

  onCloseNewOrderModal = () => {
    this.setState({modalOpen: false})
  }

  render() {
    const {orders, motoboys} = this.props.data
    const {modalOpen} = this.state

    this.startStopPolling()

    return (
      <main>
        <Button raised color="primary" className="mb-5"
          onClick={() => this.setState({modalOpen: true})}
        >
          <AddIcon className="mr-2" />
          Nova entrega
        </Button>
        <NewOrderModal open={modalOpen} onClose={this.onCloseNewOrderModal} />

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
