import React from 'react'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Drawer from 'material-ui/Drawer'
import { MenuItem } from 'material-ui/Menu'

import Central from './central'
import Auth from './auth'
import DashboardPage from './dashboard_page'
import MotoboysPage from './motoboys_page'

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

    Auth.logout(Central.current().token, () => {
      window.location.href = "/"
    })
    Central.logout()
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <div className="d-flex align-items-center">
            <Toolbar>
              <IconButton onClick={this.openDrawer} color="contrast" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography type="title" color="inherit">
                {Central.current().name}
              </Typography>
            </Toolbar>

            <div className="m-auto">
              <img src="/images/logo_icon_white.svg" width="30" style={{marginRight: "10.5rem"}} />
            </div>
          </div>
        </AppBar>

        <main className="p-4">
          <Route path="/" exact={true} component={DashboardPage} />
          <Route path="/motoboys" exact={true} component={MotoboysPage} />
        </main>

        <Drawer
          open={this.state.opened}
          onClose={this.closeDrawer}
        >
          <Link to="/" style={{width: 250}}>
            <MenuItem onClick={this.closeDrawer}>Página inicial</MenuItem>
          </Link>
          <Link to="/motoboys">
            <MenuItem onClick={this.closeDrawer}>Motoboys</MenuItem>
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
