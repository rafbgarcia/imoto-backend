import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import ListSubheader from 'material-ui/List/ListSubheader'

import Company from 'js/company'
import InitialSetup from './initial_setup'

class Dashboard extends React.Component{
  componentDidMount() {
    this.props.data.startPolling(30000)
  }

  needInitialSetup() {
    return !Company.current().location ||
      Company.current().centrals.length === 0
  }

  makeOrder() {

  }

  render() {
    const {orders, centrals} = this.props.data

    return (
      <div style={{padding: "2rem"}}>
        {this.needInitialSetup() && <InitialSetup />}

        <Grid container spacing={0}>
          <Grid item sm={3}>
            <ListSubheader>Chame um motoboy</ListSubheader>
            <Button onClick={this.makeOrder} raised color="primary">Chamar motoboy agora</Button>
          </Grid>
          <Grid item sm={5}>
            <ListSubheader>Pedidos enviados</ListSubheader>
          </Grid>
          <Grid item sm={4}>
            <ListSubheader>Finalizados</ListSubheader>
          </Grid>
        </Grid>
      </div>
    )
  }
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
