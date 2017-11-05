import React from 'react'
import Timeago from 'js/timeago'

export default class PendingOrder extends React.Component {
  render() {
    const {order, onConfirm, onCancel} = this.props

    return (
      <section className="card border-info mb-3">
        <div className="card-header bg-info text-white d-flex align-items-center justify-content-between">
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
          </div>

          {this.stops(order.stops)}

          <div className="mt-4"><strong>Total:</strong> {order.formattedPrice}</div>

          <div className="mt-4 d-flex align-items-center justify-content-between">
            <a href="javascript:;" onClick={e => onCancel(order)} className="btn btn-outline-danger">
              <i className="fa fa-times mr-2"></i>
              Cancelar
            </a>
            <a href="javascript:;" onClick={e => onConfirm(order)} className="btn btn-outline-primary">
              <i className="fa fa-check mr-2"></i>
              Confirmar
            </a>
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
