import React from 'react'
import Moment from 'react-moment'
import ListSubheader from 'material-ui/List/ListSubheader'
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import FiberManualRecordIcon from 'material-ui-icons/FiberManualRecord'
import { red, green, orange } from 'material-ui/colors'

const MotoboyItem = (motoboy, index, onClick) => {
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
    return <small className="text-muted">ficou disponível <Moment fromNow>{becameAvailableAt}</Moment></small>
  } else if (busy) {
    return <small className="text-muted">começou uma entrega <Moment fromNow>{becameBusyAt}</Moment></small>
  } else {
    return null
  }
}

export default MotoboyItem
