import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Auth from './auth'

export default class Login extends React.Component {
  state = {
    login: "",
    password: "",
  }

  didClickLoginButton = () => {
    Auth.login(this.state.login, this.state.password, () => {
      window.location.reload()
    })
  }

  render() {
    return (
      <div className="col-md-4 offset-md-4 offset-sm-3 col-sm-6">
        <div>
          <h3>Faça Login</h3>

          <form>
            <TextField floatingLabelText="Login" onChange={(_evt, value) => this.setState({login: value})} fullWidth />
            <TextField floatingLabelText="Senha" onChange={(_evt, value) => this.setState({password: value})} type="password" fullWidth />
            <RaisedButton onClick={() => this.didClickLoginButton()} label="Acessar" primary />
          </form>
        </div>
      </div>
    )
  }
}
