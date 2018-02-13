import React from 'react'
import Moment from 'react-moment'
import Paper from 'material-ui/Paper'
import KeyboardArrowDownIcon from 'material-ui-icons/KeyboardArrowDown'
import IconButton from 'material-ui/IconButton'

import OrderInfo from "./OrderInfo"

export default class FinishedOrder extends React.Component {
  state = {
    show: false
  }

  toggleDetails = () => {
    const {show} = this.state
    this.setState({ show: !show })
  }

  render() {
    const {order} = this.props
    const {show} = this.state
    const hidden = show ? "" : "d-none"

    return (
      <div className="col-md-6 mb-4">
        <Paper elevation={1} className="mb-3 pt-2 pb-2 pl-3 pr-3">
          <header className="text-muted d-flex align-items-center justify-content-between">
            <div>
              Pedido #{order.id}
              <br />
              <small>Finalizado às <Moment format="HH:mm\h">{order.finishedAt}</Moment></small>
            </div>
            <IconButton tooltip="Mostrar detalhes" onClick={this.toggleDetails}>
              <KeyboardArrowDownIcon />
            </IconButton>
          </header>

          <OrderInfo order={order} />
        </Paper>
      </div>
    )
  }
}
