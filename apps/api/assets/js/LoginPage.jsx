import React from 'react'
import PropTypes from 'prop-types'
import linkState from 'linkstate';

import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import AppBar from 'material-ui/AppBar';

import Central from 'js/central'
import Auth from './auth'

export default class LoginPage extends React.Component {
  state = {
    btnDisabled: false,
  }

  didClickLoginButton = () => {
    this.setState({btnDisabled: true})

    const {email, password} = this.state
    const {showSnack} = this.context

    showSnack("Fazendo login, aguarde...")

    Auth.login(email, password,
      (central) => {
        showSnack("Sucesso! Redirecionando...", "success")
        Central.login(central)
        window.location.href = "/central"
      },
      (errors) => {
        showSnack(errors, "error")
        this.setState({btnDisabled: false})
      },
    )
  }

  render({}, {email, password, btnDisabled}) {
    return (
      <section className="d-flex align-items-center justify-content-center mt-5">
        <div className="col-xs-10 col-sm-6 col-md-4 thumbnail">
          <Typography type="display1">Faça Login</Typography>

          <TextField
            label="Email"
            onChange={linkState(this, 'email')}
            value={email}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Senha"
            onChange={linkState(this, 'password')}
            value={password}
            margin="normal"
            type="password"
            fullWidth
          />
          <Button disabled={btnDisabled} variant="raised" color="primary" onClick={this.didClickLoginButton} className="mt-4">
            Acessar
          </Button>
        </div>
      </section>
    )
  }
}

LoginPage.contextTypes = {
  showSnack: PropTypes.func
}
