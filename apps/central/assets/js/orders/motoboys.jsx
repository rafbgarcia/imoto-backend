import React from 'react'
import Timeago from 'js/timeago'
import ListSubheader from 'material-ui/List/ListSubheader'
import Divider from 'material-ui/Divider'
import {List, ListItem} from 'material-ui/List'
import MotoboyDetails from './motoboy_details'
import FiberManualRecordIcon from 'material-ui-icons/FiberManualRecord'

export default class Motoboys extends React.Component {
  state = {
    open: false,
    clickedMotoboy: null,
  }
  openInfo = (motoboy) => this.setState({
    open: true,
    clickedMotoboy: motoboy,
  })
  closeInfo = () => this.setState({open: false})

  render() {
    const {motoboys} = this.props
    const {open, clickedMotoboy} = this.state

    if (!motoboys)
      return null

    const motoboysList = motoboys.map((motoboy, i) => {
      return Motoboy(motoboy, i, () => this.openInfo(motoboy))
    })

    return (
      <div className="card">
        <List>
          <ListSubheader>Motoboys</ListSubheader>
          {motoboysList}
        </List>

        {
          clickedMotoboy && <MotoboyDetails
            open={open}
            motoboy={clickedMotoboy}
            handleClose={this.closeInfo}
          />
        }
      </div>
    )
  }
}

function Motoboy(motoboy, index, onClick) {
  const iconClass = getIconClass(motoboy)
  let dateToShow = getDateToShow(motoboy)

  return (
    <ListItem
      key={index}
      primaryText={
        <div className="d-flex align-items-center">
          <FiberManualRecordIcon className={`${iconClass} mr-2`} style={{fontSize: 15}} />
          <span>{motoboy.name}</span>
        </div>
      }
      secondaryText={dateToShow}
      onClick={onClick}
      style={{fontSize: "0.875rem", lineHeight: 1.5, padding: 0, margin: 0}}
    />
  )
}

function getIconClass({available, busy}) {
  if (available) {
    return "text-success"
  } else if (busy) {
    return "text-warning"
  } else {
    return "text-danger"
  }
}

function getDateToShow({available, busy, becameBusyAt, becameAvailableAt}) {
  if (available) {
    return <small className="text-muted">disponível <Timeago date={becameAvailableAt} /></small>
  } else if (busy) {
    return <small className="text-muted">ocupado <Timeago date={becameBusyAt} /></small>
  }
}
