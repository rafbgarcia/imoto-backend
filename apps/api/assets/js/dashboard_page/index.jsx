import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'
import {Link} from 'react-router-dom'
import MenuIcon from 'material-ui-icons/Menu';
import indigo from 'material-ui/colors/indigo';

import Orders from './orders'
import Motoboys from './motoboys'
import NewOrderModal from './new_order_modal'

class DashboardPage extends React.Component{
  state = {
    modalOpen: false,
    hasNewOrder: false,
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
      this.props.data.startPolling(10000)
    } else {
      this.props.data.stopPolling()
    }
  }

  onCloseNewOrderModal = () => {
    const {startPolling} = this.props.data
    this.setState({modalOpen: false})

    /**
     * This line starts polling after the NewOrderModal is dismissed.
     * Without it
     */
    setTimeout(() => startPolling(2000), 1000)
  }

  render() {
    const {orders, motoboys, loading} = this.props.data
    const {modalOpen} = this.state

    const hasMotoboysAvailable = motoboys && motoboys.some((motoboy) => motoboy.available)

    this.startStopPolling()

    return (
      <main>
        {
          !loading && (!motoboys || motoboys.length === 0) &&
          <NoMotoboysMessage />
        }

        <div className="mb-5">
          <Button disabled={!hasMotoboysAvailable} raised color="primary" onClick={() => this.setState({modalOpen: true})}>
            <AddIcon className="mr-2" /> Nova entrega
            {!hasMotoboysAvailable && " *"}
          </Button>
          {
            !hasMotoboysAvailable && <div>
              <small className="text-muted">* Nenhum motoboy disponível</small>
            </div>
          }
          <NewOrderModal open={modalOpen} onClose={this.onCloseNewOrderModal} />
        </div>

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

const NoMotoboysMessage = () => (
  <div className="mb-5 ">
    <div className="alert alert-warning">
      <h4>Comece a fazer entregas em 3 passos:</h4>
      1- Cadastre seus motoboys clicando no icone (<MenuIcon style={{top: 6, position: "relative", background: indigo["500"], color: "white"}} />) acima e depois em "Motoboys".<br/>
      2- Peça aos motoboys para baixarem a app do iMoto na loja do Android ou da Apple.<br/>
      3- Assim que eles ficarem online na app, você poderá enviar pedidos.
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
