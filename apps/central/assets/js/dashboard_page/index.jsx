import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add'

import Orders from './orders'
import Motoboys from './motoboys'
import NewOrderModal from './new_order_modal'

class DashboardPage extends React.Component{
  state = {
    modalOpen: false
  }

  componentWillMount() {
    this.props.data.startPolling(30000)
  }

  render() {
    const {orders, motoboys} = this.props.data
    const {modalOpen} = this.state

    return (
      <main>
        <Button raised color="primary" className="mb-5"
          onClick={() => this.setState({modalOpen: true})}
        >
          <AddIcon className="mr-2" />
          Nova entrega
        </Button>
        <NewOrderModal open={modalOpen} onClose={() => this.setState({modalOpen: false})} />

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
        location {
          name
          reference
          line1
        }
      }
      customer {
        id name phoneNumber
      }
      company { id name phoneNumber}
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
`)((props) => <DashboardPage {...props} />)
