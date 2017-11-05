import React from 'react'
import graphql from 'js/graphql'

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

    let iconClass
    if (motoboy.available) {
      iconClass = "text-success"
    } else if (motoboy.busy) {
      iconClass = "text-warning"
    } else {
      iconClass = "text-danger"
    }

    return (
      <div>
        <i className={`fa fa-circle ${iconClass}`}></i>
        {motoboy.name}
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

