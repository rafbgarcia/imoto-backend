import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Timeago from 'js/timeago'

const MOTOBOYS_QUERY = gql`
  query getMotoboys {
    motoboys {
      id
      name
      available
      busy
      unavailable
      becameAvailableAt
      becameBusyAt
    }
  }
`
const MOTOBOY_UPDATES_SUBSCRIPTION = gql`
  subscription motoboyUpdates {
    motoboy: motoboyUpdates {
      id
      name
      available
      busy
      unavailable
      becameAvailableAt
      becameBusyAt
    }
  }
`

export default graphql(MOTOBOYS_QUERY, {
  props: (props) => {
    return {
      ...props,
      subscribeToMotoboyUpdates: params => {
        return props.data.subscribeToMore({
          document: MOTOBOY_UPDATES_SUBSCRIPTION,
          variables: {
            testing: ">>> here doh",
          },
          updateQuery: ({motoboys}, {subscriptionData: { motoboy }}) => {
            if (!motoboy) {
              return motoboys
            }

            return motoboys.map((aMotoboy) => {
              if (motoboy.id === aMotoboy.id) {
                return {...aMotoboy, ...motoboy}
              }
              return aMotoboy
            })
          }
        })
      }
    }
  },
})(Motoboys)

function Motoboys({data: {loading, error, motoboys}, subscribeToMotoboyUpdates}) {
  if (loading) return null
  subscribeToMotoboyUpdates()

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
