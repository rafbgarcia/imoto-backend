import React from 'react'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Auth from './auth'
import Typography from 'material-ui/Typography'
import Central from 'js/central'
import LoginPage from './LoginPage'
import AppBar from 'material-ui/AppBar';
import RegisterPage from './RegisterPage'

import {
  Route,
  Link
} from 'react-router-dom'

export default class AuthenticateLayout extends React.Component {
  state = {
    login: "",
    password: "",
  }

  didClickLoginButton = () => {
    Auth.login(this.state.login, this.state.password, (central) => {
      Central.login(central)
      window.location.reload()
    })
  }

  render() {
    const path = window.location.pathname

    return (
      <div>
        <AppBar position="static">
          <div className="text-center">
            <img src="/images/logo_white.svg" width="120" className="pt-3 pb-3" />
          </div>
        </AppBar>

        <section className="text-center mt-5">
          <Link to="/central" className="mr-4">
            <Button raised={path === "/central"} color="primary">
              Cadastre sua central
            </Button>
          </Link>
          <Link to="/central/login" className="mr-4">
            <Button raised={path === "/central/login"} color="primary">
              Faça login
            </Button>
          </Link>
        </section>

        <main className="p-4">
          <Route path="/central" exact={true} component={RegisterPage} />
          <Route path="/central/login" exact={true} component={LoginPage} />
        </main>

        <footer className="text-center " style={{margin: "10rem 0 2rem"}}>
          <a href="/termos-de-uso" target="_blank">Termos de uso</a>
        </footer>
      </div>
    )
  }
}
