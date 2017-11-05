import React from 'react'
import Timeago from 'js/timeago'

export default class ConfirmedOrder extends React.Component {
  render() {
    const {order} = this.props

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
}
