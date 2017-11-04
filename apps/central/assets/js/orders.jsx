import React from 'react'
import ReactDOM from 'react-dom'

import OrdersContainer from './orders/container'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<OrdersContainer />, document.querySelector('#orders'))
})
