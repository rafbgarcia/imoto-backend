import React from 'react'
import Timeago from 'js/timeago'
import Paper from 'material-ui/Paper';
import PersonIcon from 'material-ui-icons/Person';
import PhoneIcon from 'material-ui-icons/Phone';
import MotorcycleIcon from 'material-ui-icons/Motorcycle';
import PlaceIcon from 'material-ui-icons/Place';
import ListIcon from 'material-ui-icons/List';
import AttachMoneyIcon from 'material-ui-icons/AttachMoney';

export default class ConfirmedOrder extends React.Component {
  stops(stops) {
    return stops.map((stop, i) => <Stop key={i} stop={stop} />)
  }

  render() {
    const {order} = this.props

    return (
      <Paper elevation={1} className="mb-3 pt-2 pb-2 pl-3 pr-3">
        <div className="text-muted d-flex align-items-center justify-content-between">
          <span>#{order.id}</span>
          <span>confirmada <Timeago date={order.confirmedAt} /></span>
        </div>

        <div className="mt-3 d-flex align-items-center justify-content-between">
          <div>
            <div className="mb-2 d-flex align-items-center">
              <PersonIcon />
              <span>{order.customer.name}</span>
            </div>
            <div className="d-flex align-items-center">
              <PhoneIcon />
              <span>{order.customer.phoneNumber}</span>
            </div>
          </div>
          <div>
            <div className="mb-2 d-flex align-items-center">
              <MotorcycleIcon />
              <span>{order.motoboy.name}</span>
            </div>
            <div className="d-flex align-items-center">
              <AttachMoneyIcon />
              <span>{order.formattedPrice}</span>
            </div>
          </div>
        </div>

        {this.stops(order.stops)}
      </Paper>
    )
  }
}

class Stop extends React.Component {
  render() {
    const {stop} = this.props
    return (
      <section className="mt-4 mb-2">
        <div className="mb-2"><strong>{stop.sequence+1}ª parada</strong></div>
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
