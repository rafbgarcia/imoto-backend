import React from 'react'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

import Drawer from 'material-ui/Drawer'
import { MenuItem } from 'material-ui/Menu'

import Company from './company'
import Auth from './auth'
import Dashboard from 'js/dashboard/index'

import {
  Route,
  Link
} from 'react-router-dom'

export default class Layout extends React.Component {
  state = {
    opened: false,
  }

  openDrawer = () => this.setState({opened: true})
  closeDrawer = () => this.setState({opened: false})

  logout = () => {
    this.closeDrawer()

    Auth.logout(Company.current().token, () => {
      window.location.href = "/"
    })
    Company.logout()
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={this.openDrawer} color="contrast" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography type="title" color="inherit">
              {Company.current().name}
            </Typography>
          </Toolbar>
        </AppBar>

        <main className="p-4">
          <Route path="/" component={Dashboard} />
        </main>

        <Drawer
          open={this.state.opened}
          onRequestClose={this.closeDrawer}
        >
          <Link to="/">
            <MenuItem onClick={this.closeDrawer}>
              Dashboard
            </MenuItem>
          </Link>
          <Link to="/">
            <MenuItem onClick={this.logout}>
              Sair
            </MenuItem>
          </Link>
        </Drawer>
      </div>
    )
  }
}
