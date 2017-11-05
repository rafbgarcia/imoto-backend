import React from 'react'
import Timeago from 'js/timeago'

export default class ConfirmedOrder extends React.Component {
  render() {
    const {order, onCancel} = this.props

    return (
      <section className="card mb-3">
        <div className="card-header d-flex align-items-center justify-content-between">
          <span>#{order.id}</span>
          <span>pedido <Timeago date={order.insertedAt} /></span>
        </div>

        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <i className="fa fa-user mr-2"></i>
              {order.customer.name}
              <br />
              <i className="fa fa-phone mr-2"></i>
              {order.customer.phoneNumber}
            </div>
            <div>
              <i className="fa fa-motorcycle mr-2"></i>
              {order.motoboy.name}
              <div className="text-muted">
                confirmada <Timeago date={order.confirmedAt} />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  stops(stops) {
    return stops.map((stop, i) => <Stop key={i} stop={stop} />)
  }
}

class Stop extends React.Component {
  render() {
    const {stop} = this.props
    return (
      <section className="mt-4 mb-2">
        <div><strong>{stop.sequence+1}ª parada</strong></div>
        <div>
          <i className="fa fa-map-marker mr-2"></i>
          {stop.location.line1}
        </div>
        <div>
          {stop.instructions}
        </div>
      </section>
    )
  }
}
