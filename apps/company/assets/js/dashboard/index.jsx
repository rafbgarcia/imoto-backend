import React from 'react'
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
        </Grid>
        <Grid item sm={9}>
        </Grid>
      </Grid>
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
      }
    }
  }
`)((props) => <Dashboard {...props} />)
