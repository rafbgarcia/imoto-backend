import React from 'react'
import Timeago from 'js/timeago'
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';

export default class FinishedOrder extends React.Component {
  render() {
    const {order} = this.props

    return (
      <Paper zDepth={1} className="mb-3 pt-2 pb-2 pl-3 pr-3">
        <div className="text-muted">
          <span>#{order.id}</span>
        </div>

        <div className="mt-3">
          <div className="mb-2 d-flex align-items-center">
            <FontIcon className="material-icons mr-2">person</FontIcon>
            <span>{order.customer.name}</span>
          </div>
          <div className="mb-2 d-flex align-items-center">
            <FontIcon className="material-icons mr-2">phone</FontIcon>
            <span>{order.customer.phoneNumber}</span>
          </div>
          <div className="mb-2 d-flex align-items-center">
            <FontIcon className="material-icons mr-2">motorcycle</FontIcon>
            <span>{order.motoboy.name}</span>
          </div>
          <div className="text-muted">
            <small>Finalizada <Timeago date={order.finishedAt} /></small>
          </div>
        </div>
      </Paper>
    )
  }
}
