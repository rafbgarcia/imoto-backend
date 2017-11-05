import React from 'react'
import graphql from 'js/graphql'
import Timeago from 'js/timeago'

export default class Motoboys extends React.Component {
  state = {
    motoboys: []
  }

  componentDidMount() {
    graphql.run(query())
      .then((data) => {
        const motoboys = data.motoboys
        this.setState({ motoboys })
      })
  }

  render() {
    return (
      <div>
        <h4>Motoboys</h4>
        {this.motoboys()}
      </div>
    )
  }

  motoboys() {
    const {motoboys} = this.state
    return motoboys.map((motoboy, i) => <Motoboy key={i} motoboy={motoboy} />)
  }
}

class Motoboy extends React.Component {
  render() {
    const {motoboy} = this.props

    let iconClass, dateToShow
    if (motoboy.available) {
      iconClass = "text-success"
      dateToShow = <span>disponível <Timeago date={motoboy.becameAvailableAt} /></span>
    } else if (motoboy.busy) {
      iconClass = "text-warning"
      dateToShow = <span>ocupado <Timeago date={motoboy.becameBusyAt} /></span>
    } else {
      iconClass = "text-danger"
    }

    return (
      <div className="card mb-2">
        <div className="card-body p-2">
          <i className={`fa fa-circle ${iconClass} mr-2`}></i>
          {motoboy.name}
          <div><small className="text-muted">{dateToShow}</small></div>
        </div>
      </div>
    )
  }
}

function query() {
  return `query getMotoboys {
    motoboys {
      name
      available
      busy
      unavailable
      becameAvailableAt
      becameBusyAt
    }
  }`
}

