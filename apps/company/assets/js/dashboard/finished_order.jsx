import React from 'react'
import Timeago from 'js/timeago'
import Paper from 'material-ui/Paper'
import PersonIcon from 'material-ui-icons/Person'
import PhoneIcon from 'material-ui-icons/Phone'
import MotorcycleIcon from 'material-ui-icons/Motorcycle'
import KeyboardArrowDownIcon from 'material-ui-icons/KeyboardArrowDown'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui-icons/Home'

export default class FinishedOrder extends React.Component {
  state = {
    show: false
  }

  render() {
    const {order} = this.props
    const {show} = this.state
    const hidden = show ? "" : "d-none"

    return (
      <Paper elevation={1} className="mb-3 pt-2 pb-2 pl-3 pr-3">
        <div className="text-muted d-flex align-items-center justify-content-between">
          <span>#{order.id}</span>

          <IconButton
            tooltip="Mostrar detalhes"
            onClick={() => this.setState({show: !show})}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </div>

        <div className={`mt-3 ${hidden}`}>
          <div className="mb-2 d-flex align-items-center">
            <MotorcycleIcon />
            <span className="ml-2">{order.motoboy.name}</span>
          </div>
          <div className="mb-2 d-flex align-items-center">
            <HomeIcon />
            <span className="ml-2">{order.motoboy.central.name}</span>
          </div>
          <div className="text-muted">
            <small>Finalizada <Timeago date={order.finishedAt} /></small>
          </div>
        </div>
      </Paper>
    )
  }
}
