import React from 'react'
import { MenuItem } from 'material-ui/Menu'
import { Route, Link } from 'react-router-dom'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const Nav = () => {
  return (
    <nav className="col-md-2 mb-5">
      <Link to="/central">
        <MenuItem selected={isSelected("/central")}>Entregas de hoje</MenuItem>
      </Link>

      <Link to="/central/nova-entrega">
        <MenuItem selected={isSelected("/central/nova-entrega")}>Nova entrega</MenuItem>
      </Link>

      <Link to="/central/motoboys">
        <MenuItem selected={isSelected("/central/motoboys")}>Motoboys</MenuItem>
      </Link>

      <Link to="/central/localizacao">
        <MenuItem selected={isSelected("/central/localizacao")}>Locazalição dos motoboys</MenuItem>
      </Link>
    </nav>
  )
}

function isSelected(route) {
  return route == window.location.pathname
}

export default Nav
