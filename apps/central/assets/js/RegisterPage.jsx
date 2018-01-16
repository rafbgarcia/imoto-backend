import React from 'react'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Auth from './auth'
import Typography from 'material-ui/Typography'
import AppBar from 'material-ui/AppBar';

import Central from 'js/central'
import PhoneField from 'js/shared/phone_field'
import CnpjField from 'js/shared/CnpjField'

export default class RegisterPage extends React.Component {
  state = {
    login: "",
    password: "",
    company: {
      name: "",
      email: "",
      phoneNumber: "",
      cnpj: "",
      login: "",
      password: "",
    },
  }

  didClickRegisterButton = () => {
    Auth.login(this.state.login, this.state.password, (central) => {
      Central.login(central)
      window.location.reload()
    })
  }

  updateCompany = (evt) => {
    const changes = {[evt.target.name]: evt.target.value}
    this.setState({company: {...this.state.company, ...changes}})
  }

  render() {
    const {company} = this.state

    return (
      <section className="d-flex align-items-center justify-content-center mt-5">
        <div className="col-xs-10 col-sm-6 col-md-4 thumbnail">
          <Typography type="display1">Informe os dados abaixo</Typography>

          <div className="d-flex align-items-center">
            <TextField
              label="Nome da central"
              onChange={this.updateCompany}
              margin="normal"
              className="mr-4"
              name="name"
              fullWidth
            />
            <PhoneField
              label="Telefone"
              name="phoneNumber"
              onChange={this.updateCompany}
              value={company.phoneNumber}
              fullWidth
            />
          </div>
          <div className="d-flex align-items-center">
            <CnpjField
              label="CNPJ"
              onChange={this.updateCompany}
              name="cnpj"
              margin="normal"
              helperText="CNPJ é requerido para aumentar a segurança dos clientes"
              fullWidth
            />
          </div>
          <section className="d-flex align-items-center">
            <TextField
              label="E-mail"
              onChange={this.updateCompany}
              name="email"
              margin="normal"
              className="mr-4"
              fullWidth
            />
            <TextField
              fullWidth
              label="Senha"
              onChange={this.updateCompany}
              margin="normal"
              type="password"
            />
          </section>
          <Button raised color="primary" onClick={this.didClickRegisterButton} className="mt-4">
            Cadastrar
          </Button>
        </div>
      </section>
    )
  }
}
