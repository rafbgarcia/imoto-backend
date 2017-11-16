import React from 'react'
import Orders from './orders'
import Motoboys from './motoboys'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

class OrdersContainer extends React.Component{
  componentDidMount() {
    this.props.data.startPolling(1000)
  }

  render() {
    const {orders, motoboys} = this.props.data
    return (
      <div className="row">
        <div className="col-sm-3">
          <Motoboys motoboys={motoboys} />
        </div>
        <div className="col-sm-9">
          <Orders orders={orders} />
        </div>
      </div>
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
`)((props) => <OrdersContainer {...props} />)
