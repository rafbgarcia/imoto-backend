import React from 'react'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import OrdersContainer from './orders/container'
import client from './graphql_client'

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
          iconElementRight={<IconButton>
            <FontIcon className="material-icons">settings</FontIcon>
        </IconButton>}
        />

        <div className="row">
          <div className="col-md-6">
          </div>
          <div className="col-md-3">
          </div>
        </div>

        <Drawer
          docked={false}
          open={this.state.opened}
          onRequestChange={(opened) => this.setState({opened})}
        >

          <MenuItem leftIcon={<FontIcon className="material-icons">dashboard</FontIcon>}>
            Dashboard
          </MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons">power_settings_new</FontIcon>}>
            Sair
          </MenuItem>
        </Drawer>
      </div>
    )
  }
}
