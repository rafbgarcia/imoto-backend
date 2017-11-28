import React from 'react'
import gql from 'graphql-tag'
import apolloClient from 'js/graphql_client'
import { graphql } from 'react-apollo'
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import ListSubheader from 'material-ui/List/ListSubheader'
import Snackbar from 'material-ui/Snackbar'
import CloseIcon from 'material-ui-icons/Close'
import IconButton from 'material-ui/IconButton'

import Company from 'js/company'
import InitialSetup from './initial_setup'
import OrderInProgress from './order_in_progress'

class Dashboard extends React.Component {
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
          id
          pending
          confirmed
          insertedAt
        }
      }
    `
    apolloClient.mutate({
      mutation: MUTATION,
      variables: {orderParams: this.orderParams()},
    })
    .then((res) => this.setState({hasPendingOrder: true}))
    .catch((res) => {
      this.setState({
        showSnackbar: true,
        errorMessage: res.graphQLErrors[0].message,
      })
    })
  }

  startStopPolling(pendingOrders, confirmedOrders) {
    if (pendingOrders.length > 0) {
      this.props.data.startPolling(3000)
    } else if (confirmedOrders.length > 0) {
      this.props.data.startPolling(60000)
    } else {
      this.props.data.stopPolling()
    }
  }

  render() {
    const {loading} = this.props.data
    const orders = this.props.data.orders || []
    const pendingOrders = orders.filter((order) => order.pending)
    const confirmedOrders = orders.filter((order) => order.confirmed)
    const finishedOrders = orders.filter((order) => order.finished)
    this.startStopPolling(pendingOrders, finishedOrders)
    const ordersInProgress = pendingOrders.concat(confirmedOrders)

    return (
      <div style={{padding: "2rem"}}>
        {this.needInitialSetup() && <InitialSetup />}

        <Grid container spacing={0}>
          <Grid item sm={3}>
            <ListSubheader>Chame um motoboy</ListSubheader>
            <Button onClick={() => this.makeOrder()} raised color="primary">Chamar motoboy agora</Button>
          </Grid>
          <Grid item sm={5}>
            <ListSubheader>Pedidos enviados</ListSubheader>
            {!loading && ordersInProgress.map(OrderInProgress)}
          </Grid>
          <Grid item sm={4}>
            <ListSubheader>Finalizados</ListSubheader>
            {!loading && finishedOrders.map(FinishedOrder)}
          </Grid>
        </Grid>

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

const FinishedOrder = (a, i) => {
  return (
    <div key={i}>Finished</div>
  )
}

export default graphql(gql`
  query getInfo {
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
        central { name }
      }
    }
  }
`)((props) => <Dashboard {...props} />)
