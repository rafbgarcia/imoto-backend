import React from 'react'
import { Route } from 'react-router-dom'

import List from './List'
import New from './New'
import Edit from './Edit'

export default class MotoboysPage extends React.Component{
  render() {
    return (
      <div>
        <Route path="/central/motoboys" exact={true} component={List} />
        <Route path="/central/motoboys/novo" exact={true} component={New} />
        <Route path="/central/motoboys/:id/editar" exact={true} component={Edit} />
      </div>
    )
  }
}

