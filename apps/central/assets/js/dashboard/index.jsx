import React from 'react'
import Orders from './orders'
import Motoboys from './motoboys'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import Grid from 'material-ui/Grid'

class Dashboard extends React.Component{
  componentDidMount() {
    this.props.data.startPolling(30000)
  }

  render() {
    const {orders, motoboys} = this.props.data
    return (
      <Grid container spacing={0}>
        <Grid item sm={3}>
          <Motoboys motoboys={motoboys} />
        </Grid>
        <Grid item sm={9}>
          <Orders orders={orders} />
        </Grid>
      </Grid>
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
        location {
          name
          reference
          line1
        }
      }
      customer {
        id
        name
        phoneNumber
      }
      motoboy {
        id
        name
      }
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
`)((props) => <Dashboard {...props} />)
