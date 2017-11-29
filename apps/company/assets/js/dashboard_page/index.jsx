import React from 'react'
import gql from 'graphql-tag'
import apolloClient from 'js/graphql_client'
import { graphql } from 'react-apollo'
import Button from 'material-ui/Button'
import ListSubheader from 'material-ui/List/ListSubheader'
import Snackbar from 'material-ui/Snackbar'
import CloseIcon from 'material-ui-icons/Close'
import IconButton from 'material-ui/IconButton'

import Company from 'js/company'
import InitialSetup from './initial_setup'
import OrderInProgress from './order_in_progress'
import FinishedOrder from './finished_order'

class DashboardPage extends React.Component {
  state = {
    errorMessage: null,
    showSnackbar: false,
  }

  needInitialSetup() {
    return !Company.current().location ||
      Company.current().centrals.length === 0
  }

  orderParams() {
    const {
      name, street, number, neighborhood, zipcode, city, uf, complement, reference,
    } = Company.current().location

    return {
      stops: [{
        sequence: 0,
        instructions: "Ir até a empresa e falar com o responsável",
        location: {name, street, number, neighborhood, zipcode, city, uf, complement, reference},
      }]
    }
  }

  makeOrder() {
    const MUTATION = gql`
      mutation makeOrder($orderParams: OrderParams) {
        order: createOrder(orderParams: $orderParams) {
          pending
          insertedAt
        }
      }
    `
    apolloClient.mutate({
      mutation: MUTATION,
      variables: {
        orderParams: this.orderParams()
      },
      optimisticResponse: {
        order: {
          __typename: "Order",
          pending: true,
          insertedAt: new Date(),
        },
      },
      update: (_store, { data: { order } }) => {
        this.setState({ newPendingOrder: order })
      },
    })
    // .then((res) => this.setState({ newPendingOrder: null }))
    .catch((res) => {
      this.setState({
        newPendingOrder: null,
        showSnackbar: true,
        errorMessage: res.graphQLErrors[0].message,
      })
    })
  }

  startStopPolling(pendingOrders, confirmedOrders) {
    if (pendingOrders.length > 0) {
      this.props.data.startPolling(2000)
    } else if (confirmedOrders.length > 0) {
      this.props.data.startPolling(10000)
    } else {
      this.props.data.stopPolling()
    }
  }

  render() {
    const {loading} = this.props.data
    const {newPendingOrder} = this.state

    const orders = this.props.data.orders || []
    const pendingOrders = orders.filter((order) => order.pending)
    if (newPendingOrder) {
      if (pendingOrders.length === 0) {
        pendingOrders.unshift(newPendingOrder)
      } else {
        this.setState({newPendingOrder: null})
      }
    }
    const confirmedOrders = orders.filter((order) => order.confirmed)
    const finishedOrders = orders.filter((order) => order.finished)
    const ordersInProgress = pendingOrders.concat(confirmedOrders)
    const canOrder = pendingOrders.length === 0

    this.startStopPolling(pendingOrders, finishedOrders)

    return (
      <div style={{padding: "2rem"}}>
        {this.needInitialSetup() && <InitialSetup />}

        <section className="row">
          <div className="col-sm-3">
            <ListSubheader>Chame um motoboy</ListSubheader>
            <Button disabled={!canOrder} onClick={() => this.makeOrder()} raised color="primary">Chamar motoboy agora</Button>
          </div>
          <div className="col-sm-3">
            <ListSubheader>Pedidos enviados</ListSubheader>
            {!loading && ordersInProgress.map(OrderInProgress)}
          </div>
          <div className="col-sm-3">
            <ListSubheader>Finalizados</ListSubheader>
            {!loading && finishedOrders.map((order, i) => <FinishedOrder key={i} order={order} />)}
          </div>
        </section>

        <Snackbar
          anchorOrigin={{vertical: 'top', horizontal: 'right'}}
          open={this.state.showSnackbar}
          autoHideDuration={5000}
          onRequestClose={() => this.setState({showSnackbar: false})}
          SnackbarContentProps={{'aria-describedby': 'message-id'}}
          message={this.state.errorMessage}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => this.setState({showSnackbar: false})}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    )
  }
}

export default graphql(gql`
  query getOrders {
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
        location {
          name
          reference
          line1
        }
      }
      motoboy {
        id
        name
        phoneNumber
        central { name phoneNumber }
      }
    }
  }
`)((props) => <DashboardPage {...props} />)
