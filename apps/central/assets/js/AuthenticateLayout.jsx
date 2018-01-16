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
    return (
      <div>
        <AppBar position="static">
          <div className="text-center">
            <img src="/images/logo_white.svg" width="80" className="pt-3 pb-3" />
          </div>
        </AppBar>

        <section className="text-center mt-5">
          <Link to="/" className="mr-4">
            <Button color="primary">
              Faça login
            </Button>
          </Link>
          <Link to="/cadastro">
            <Button raised color="primary">
              Cadastre sua central
            </Button>
          </Link>
        </section>

        <main className="p-4">
          <Route path="/" exact={true} component={LoginPage} />
          <Route path="/cadastro" exact={true} component={RegisterPage} />
        </main>
      </div>
    )
  }
}
