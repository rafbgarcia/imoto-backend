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

class Dashboard extends React.Component{
  state = {
    errorMessage: null,
    showSnackbar: false,
    ordersInProgress: [],
    finishedOrders: [],
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
        instructions: "Ir na empresa",
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
      variables: {orderParams: this.orderParams()}
    })
    .then((res) => this.pendingOrders.push(res.data.order))
    .catch((res) => {
      this.setState({
        showSnackbar: true,
        errorMessage: res.graphQLErrors[0].message,
      })
    })
  }

  render() {
    const orders = this.props.data.orders || []
    this.setState({
      ordersInProgress: orders.filter((order) => !order.finished),
      finishedOrders: orders.filter((order) => order.finished),
    })
    const {ordersInProgress, finishedOrders} = this.state

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
            {ordersInProgress.map(OrderInProgress)}
          </Grid>
          <Grid item sm={4}>
            <ListSubheader>Finalizados</ListSubheader>
            {finishedOrders.map(FinishedOrder)}
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

const OrderInProgress = () => {
  return (
    <div>In progress</div>
  )
}

const FinishedOrder = () => {
  return (
    <div>Finished</div>
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
      }
    }
  }
`)((props) => <Dashboard {...props} />)
