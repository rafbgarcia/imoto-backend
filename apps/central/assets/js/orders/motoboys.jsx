import React from 'react'
import Timeago from 'js/timeago'
import FontIcon from 'material-ui/FontIcon';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

export default class Motoboys extends React.Component {
  render() {
    const {motoboys} = this.props
    if (!motoboys) return null
    return (
      <div className="card">
        <Subheader>Motoboys</Subheader>
        {motoboys.map(Motoboy)}
      </div>
    )
  }
}

function Motoboy(motoboy, index) {
  const iconClass = getIconClass(motoboy)
  const dateToShow = getDateToShow(motoboy)

  return (
    <div key={index}>
      <div className="p-2 pl-3">
        <div className="d-flex align-items-center">
          <FontIcon className={`${iconClass} mr-2 material-icons`} style={{fontSize: 15}}>fiber_manual_record</FontIcon>
          <span>{motoboy.name}</span>
        </div>
        <div><small className="text-muted">{dateToShow}</small></div>
      </div>
      <Divider />
    </div>
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
    return <span>disponível <Timeago date={becameAvailableAt} /></span>
  } else if (busy) {
    return <span>ocupado <Timeago date={becameBusyAt} /></span>
  }
}
