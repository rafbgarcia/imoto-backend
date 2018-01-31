import React from 'react'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Auth from './auth'
import Typography from 'material-ui/Typography'
import AppBar from 'material-ui/AppBar';
import Central from 'js/central'

export default class LoginPage extends React.Component {
  state = {
    email: "",
    password: "",
  }

  didClickLoginButton = () => {
    const {email, password} = this.state

    Auth.login(email, password, (central) => {
      Central.login(central)
      window.location.reload()
    })
  }

  render() {
    return (
      <section className="d-flex align-items-center justify-content-center mt-5">
        <div className="col-xs-10 col-sm-6 col-md-4 thumbnail">
          <Typography type="display1">Faça Login</Typography>

          <TextField
            label="Email"
            onChange={(evt) => this.setState({email: evt.target.value})}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Senha"
            onChange={(evt) => this.setState({password: evt.target.value})}
            margin="normal"
            type="password"
            fullWidth
          />
          <Button raised color="primary" onClick={this.didClickLoginButton} className="mt-4">
            Acessar
          </Button>
        </div>
      </section>
    )
  }
}
