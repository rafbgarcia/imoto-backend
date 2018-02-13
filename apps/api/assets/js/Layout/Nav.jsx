import React from 'react'
import { MenuItem } from 'material-ui/Menu'
import { Route, Link } from 'react-router-dom'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const Nav = () => {
  return (
    <nav className="col-sm-2">
      <div className="mb-4">
        <Link to="/central/nova-entrega">
          <Button
            fullWidth
            size="large"
            variant="raised"
            color={isSelected("/central/nova-entrega") ? "primary" : "default" }
          >
            <AddIcon className="mr-1" />
            Nova entrega
          </Button>
        </Link>
      </div>

      <Link to="/central">
        <MenuItem selected={isSelected("/central")}>Entregas de hoje</MenuItem>
      </Link>

      <Link to="/central/motoboys">
        <MenuItem selected={isSelected("/central/motoboys")}>Motoboys</MenuItem>
      </Link>
    </nav>
  )
}

function isSelected(route) {
  return route == window.location.pathname
}

export default Nav
