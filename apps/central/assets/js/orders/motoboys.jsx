import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Timeago from 'js/timeago'

export default graphql(gql`
  query getMotoboys {
    motoboys {
      name
      available
      busy
      unavailable
      becameAvailableAt
      becameBusyAt
    }
  }
`)(Motoboys)

function Motoboys({data: {loading, error, motoboys}}) {
  if (loading) return null
  return (
    <div>
      <h4>Motoboys</h4>
      {motoboys.map(Motoboy)}
    </div>
  )
}

function Motoboy(motoboy, index) {
  const iconClass = getIconClass(motoboy)
  const dateToShow = getDateToShow(motoboy)

  return (
    <div key={index} className="card mb-2">
      <div className="card-body p-2">
        <i className={`fa fa-circle ${iconClass} mr-2`}></i>
        {motoboy.name}
        <div><small className="text-muted">{dateToShow}</small></div>
      </div>
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
