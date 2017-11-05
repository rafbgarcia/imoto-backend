import React from 'react'
import axios from 'axios'
import Orders from './orders'
import Motoboys from './motoboys'

export default class OrdersContainer extends React.Component{

  render() {
    return (
      <div className="row">
        <div className="col-sm-10">
          <Orders />
        </div>
        <div className="col-sm-2">
          <Motoboys />
        </div>
      </div>
    )
  }
}
