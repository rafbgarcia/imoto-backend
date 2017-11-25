import React from 'react'
import AppBar from 'material-ui/AppBar'
import FontIcon from 'material-ui/FontIcon'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

import Auth from './auth'
import OrdersContainer from './orders/container'

import {
  Route,
  Link
} from 'react-router-dom'

export default class Main extends React.Component {
  state = {
    opened: false,
  }

  handleToggle = () => this.setState({opened: !this.state.opened})

  closeDrawer = () => this.setState({opened: false})

  logout = () => {
    this.closeDrawer()
    Auth.logout(() => {
      window.location.href = "/"
    })
  }

  render() {
    return (
      <div>
        <AppBar
          title="Central"
          onLeftIconButtonTouchTap={this.handleToggle}
        />

        <main className="p-4">
          <Route path="/dashboard" component={OrdersContainer} />
        </main>

        <Drawer
          docked={false}
          open={this.state.opened}
          onRequestChange={(opened) => this.setState({opened})}
        >
          <Link to="/dashboard">
            <MenuItem onClick={this.closeDrawer} leftIcon={<FontIcon className="material-icons">dashboard</FontIcon>}>
              Dashboard
            </MenuItem>
          </Link>
          <Link to="/">
            <MenuItem onClick={this.logout} leftIcon={<FontIcon className="material-icons">power_settings_new</FontIcon>}>
              Sair
            </MenuItem>
          </Link>
        </Drawer>
      </div>
    )
  }
}
