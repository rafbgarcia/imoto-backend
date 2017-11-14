import React from 'react'
import AppBar from 'material-ui/AppBar'
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import OrdersContainer from './orders/container'
import client from './graphql_client'

import {
  Route,
  Link
} from 'react-router-dom'

export default class Main extends React.Component {
  state = {
    opened: false,
  }
  handleToggle = () => this.setState({opened: !this.state.opened})

  render() {
    return (
      <div>
        <AppBar
          title="Central"
          onLeftIconButtonTouchTap={this.handleToggle}
        />

        <main className="p-4">
          <Route path="/extranet/dashboard" component={OrdersContainer} />
        </main>

        <Drawer
          docked={false}
          open={this.state.opened}
          onRequestChange={(opened) => this.setState({opened})}
        >
          <Link to="/extranet/dashboard">
            <MenuItem leftIcon={<FontIcon className="material-icons">dashboard</FontIcon>}>
                Dashboard
            </MenuItem>
          </Link>
          <MenuItem leftIcon={<FontIcon className="material-icons">power_settings_new</FontIcon>}>
            Sair
          </MenuItem>
        </Drawer>
      </div>
    )
  }
}
