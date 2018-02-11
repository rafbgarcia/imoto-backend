import React from 'react'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu'
import AddIcon from 'material-ui-icons/Add'

import Central from './central'
import Auth from './auth'
import DashboardPage from './dashboard_page'
import MotoboysPage from './motoboys_page'
import NewOrderPage from './NewOrderPage'

import { Route, Link } from 'react-router-dom'

export default class Layout extends React.Component {
  logout = () => {
    Auth.logout(Central.current().token, () => {
      window.location.reload()
    })
    Central.logout()
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <div className="pl-3 pr-3">
            <div className="row">
              <Toolbar className="col-sm-4">
                <h4>{Central.current().name}</h4>
              </Toolbar>

              <div className="col-sm-4 text-center mt-3">
                <img src="/images/logo_white.svg" width="120" />
              </div>

              <div className="col-sm-4 d-flex align-items-center flex-row-reverse">
                <Link to="/central">
                  <MenuItem onClick={this.logout} className="text-white">
                    Sair
                  </MenuItem>
                </Link>
              </div>
            </div>
          </div>
        </AppBar>

        <div className="pl-3 pr-3">
          <section className="row mt-4">
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
                <MenuItem selected={isSelected("/central")}>Início</MenuItem>
              </Link>
              <Link to="/central/motoboys">
                <MenuItem selected={isSelected("/central/motoboys")}>Motoboys</MenuItem>
              </Link>
            </nav>

            <main className="col-sm-10">
              <Route path="/central" exact={true} component={DashboardPage} />
              <Route path="/central/motoboys" exact={true} component={MotoboysPage} />
              <Route path="/central/nova-entrega" exact={true} component={NewOrderPage} />
            </main>
          </section>
        </div>

        <footer className="text-center " style={{margin: "10rem 0 2rem"}}>
          <a href="/termos-de-uso" target="_blank">Termos de uso</a>
        </footer>
      </div>
    )
  }
}


function isSelected(route) {
  return route ==location.pathname
}
