import React from 'react'
import Timeago from 'js/timeago'
import ListSubheader from 'material-ui/List/ListSubheader'
import Divider from 'material-ui/Divider'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import MotoboyDetails from './motoboy_details'
import FiberManualRecordIcon from 'material-ui-icons/FiberManualRecord'
import { red, green, orange } from 'material-ui/colors'

export default class Motoboys extends React.Component {
  state = {
    open: false,
    clickedMotoboy: null,
  }

  openInfo = (motoboy) => this.setState({open: true, clickedMotoboy: motoboy})
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
        <ListSubheader>Motoboys</ListSubheader>
        {motoboysList}

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
  const iconColor = getIconColor(motoboy)
  let dateToShow = getDateToShow(motoboy)

  return (
    <ListItem button key={index} onClick={onClick}>
      <ListItemIcon>
        <FiberManualRecordIcon style={{color: iconColor, width: 20}} className="mr-2" />
      </ListItemIcon>
      <ListItemText
        primary={
          <div className="d-flex align-items-center">
            <span>{motoboy.name}</span>
          </div>
        }
        secondary={dateToShow}
        style={{lineHeight: 1.5, padding: 0, margin: 0}}
      />
    </ListItem>
  )
}

function getIconColor({available, busy}) {
  if (available) {
    return green[500]
  } else if (busy) {
    return orange[500]
  } else {
    return red[500]
  }
}

function getDateToShow({available, busy, becameBusyAt, becameAvailableAt}) {
  if (available) {
    return <small className="text-muted">disponível <Timeago date={becameAvailableAt} /></small>
  } else if (busy) {
    return <small className="text-muted">ocupado <Timeago date={becameBusyAt} /></small>
  }
}
