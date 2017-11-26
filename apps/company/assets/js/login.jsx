import React from 'react'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Auth from './auth'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Company from 'js/company'

export default class Login extends React.Component {
  state = {
    login: "",
    password: "",
  }

  didClickLoginButton = () => {
    Auth.login(this.state.login, this.state.password, (company) => {
      Company.login(company)
      window.location.reload()
    })
  }

  render() {
    return (
      <Grid container alignItems="center" justify="center" spacing={0}>
        <Grid item xs={10} sm={6} md={4}>
          <Typography type="display1">Faça Login</Typography>

          <TextField
            label="Login"
            onChange={(evt) => this.setState({login: evt.target.value})}
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
          <Button raised color="primary" onClick={this.didClickLoginButton}>
            Acessar
          </Button>
        </Grid>
      </Grid>
    )
  }
}
