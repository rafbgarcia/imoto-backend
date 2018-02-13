import React from 'react'
import Moment from 'react-moment'
import Paper from 'material-ui/Paper';
import PlaceIcon from 'material-ui-icons/Place';
import ListIcon from 'material-ui-icons/List';

import OrderInfo from "./OrderInfo"

export default class ConfirmedOrder extends React.Component {
  stops(stops) {
    return stops.map((stop, i) => <Stop key={i} stop={stop} />)
  }

  render() {
    const {order} = this.props

    return (
      <div className="col-md-6 mb-4">
        <Paper elevation={3} className="mb-3 p-3">
          <header className="text-center text-muted">
            <span>Pedido #{order.id}</span>
            <br />
            <small>Confirmado <Moment fromNow>{order.confirmedAt}</Moment></small>
          </header>

          <hr className="mt-2 mb-2" />

          <OrderInfo order={order} />

          {this.stops(order.stops)}
        </Paper>
      </div>
    )
  }
}

class Stop extends React.Component {
  render() {
    const {stop} = this.props
    return (
      <section className="mt-4 mb-2 fz-80">
        <div className="mb-2 fw-500">{stop.sequence+1}ª parada</div>
        <div className="mb-2 d-flex align-items-center">
          <PlaceIcon className="mr-2" />
          {stop.line1}
        </div>
        <div className="d-flex align-items-center">
          <ListIcon className="mr-2" />
          {stop.instructions}
        </div>
      </section>
    )
  }
}
