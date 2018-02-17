import React from 'react'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import { MenuItem } from 'material-ui/Menu'
import { Route, Link } from 'react-router-dom'

import Central from 'js/central'
import Auth from 'js/auth'
import DashboardPage from 'js/DashboardPage'
import MotoboysPage from 'js/MotoboysPage'
import NewOrderPage from 'js/NewOrderPage'
import LocationPage from 'js/LocationPage'
import Nav from './Nav'

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
            <Nav />

            <main className="col-sm-10">
              <Route path="/central" exact={true} component={DashboardPage} />
              <Route path="/central/motoboys" exact={false} component={MotoboysPage} />
              <Route path="/central/nova-entrega" exact={true} component={NewOrderPage} />
              <Route path="/central/localizacao" exact={true} component={LocationPage} />
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
