import React from 'react'
import Timeago from 'js/timeago'
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';

export default class PendingOrder extends React.Component {
  render() {
    const {order} = this.props

    return (
      <Paper zDepth={1} className="mb-3 pt-2 pb-2 pl-3 pr-3">
        <div className="text-muted d-flex align-items-center justify-content-between">
          <span>#{order.id}</span>
          <span>pedido <Timeago date={order.insertedAt} /></span>
        </div>

        <div className="mt-3 d-flex align-items-start justify-content-between">
          <div>
            <div className="mb-2 d-flex align-items-center">
              <FontIcon className="material-icons mr-2">person</FontIcon>
              <span>{order.customer.name}</span>
            </div>
            <div className="mb-2 d-flex align-items-center">
              <FontIcon className="material-icons mr-2">phone</FontIcon>
              <span>{order.customer.phoneNumber}</span>
            </div>
          </div>
          <div>
            <div className="mb-2 d-flex align-items-center">
              <FontIcon className="material-icons mr-2">motorcycle</FontIcon>
              <span>{order.motoboy.name}</span>
            </div>
            <div className="d-flex align-items-center">
              <FontIcon className="material-icons mr-2">attach_money</FontIcon>
              <span>{order.formattedPrice}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 mb-2 d-flex align-items-center justify-content-center">
          <CircularProgress size={20} />
          <span className="ml-2 text-muted">Aguardando confirmação...</span>
        </div>
      </Paper>
    )
  }
}
