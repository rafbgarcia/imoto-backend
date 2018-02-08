import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Auth from './auth'
import Typography from 'material-ui/Typography'
import AppBar from 'material-ui/AppBar'
import Checkbox from 'material-ui/Checkbox'
import {FormControlLabel} from 'material-ui/Form'
import gql from 'graphql-tag'
import apolloClient from 'js/graphql_client'

import Central from 'js/central'
import PhoneField from 'js/shared/phone_field'
import CnpjField from 'js/shared/CnpjField'
import * as validate from 'js/shared/validations'

export default class RegisterPage extends React.Component {
  state = {
    btnDisabled: false,
    central: {
      name: "",
      email: "",
      phoneNumber: "",
      cnpj: "",
      password: "",
      acceptedTermsOfUse: false,
    },
  }

  updateCompany = (evt) => {
    const changes = {[evt.target.name]: evt.target.value}
    this.setState({central: {...this.state.central, ...changes}})
  }

  updateTermsOfUse = (evt) => {
    const changes = {acceptedTermsOfUse: !this.state.central.acceptedTermsOfUse}
    this.setState({central: {...this.state.central, ...changes}})
  }

  canRegister() {
    const {central: {acceptedTermsOfUse, name, email, phoneNumber, cnpj, password}} = this.state
    return acceptedTermsOfUse === true && validate.notBlank(name, email, phoneNumber, cnpj, password)
  }

  didClickRegisterButton = () => {
    this.setState({btnDisabled: true})

    const {central} = this.state
    const {showSnack} = this.context

    showSnack("Criando cadastro...")

    apolloClient.mutate({
      mutation: gql`mutation Register($params: CompanyParams) {
        central: register(params: $params) {
          id
          name
          email
          cnpj
          acceptedTermsOfUse
          phoneNumber
          token
        }
      }`,
      variables: {params: central},
    })
    .then(({data: {central}}) => {
      showSnack("Conta criada com sucesso! Redirecionando...", "success")
      Central.login(central)
      window.location.href = "/central"
    })
    .catch((errors) => {
      this.setState({btnDisabled: false})
      showSnack(errors, "error")
    })
  }

  render() {
    const {central} = this.state

    return (
      <section className="d-flex align-items-center justify-content-center mt-5">
        <div className="col-xs-10 col-sm-6 col-md-4 thumbnail">
          <Typography type="display1">Informe os dados abaixo</Typography>

          <div className="d-flex align-items-center">
            <TextField
              label="* Nome da central"
              onChange={this.updateCompany}
              margin="normal"
              className="mr-4"
              name="name"
              value={central.name}
              fullWidth
            />
            <PhoneField
              label="* Telefone"
              name="phoneNumber"
              margin="normal"
              onChange={this.updateCompany}
              value={central.phoneNumber}
              fullWidth
            />
          </div>

          <CnpjField
            label="* CNPJ"
            name="cnpj"
            margin="normal"
            onChange={this.updateCompany}
            value={central.cnpj}
            helperText="Para dar mais segurança aos clientes, checaremos se sua central realmente existe"
            fullWidth
          />

          <div className="d-flex align-items-center">
            <TextField
              error={!validate.email(central.email)}
              label="* E-mail"
              onChange={this.updateCompany}
              name="email"
              margin="normal"
              className="mr-4"
              value={central.email}
              fullWidth
            />
            <TextField
              fullWidth
              label="* Senha"
              name="password"
              onChange={this.updateCompany}
              margin="normal"
              value={central.password}
              type="password"
            />
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={central.acceptedTermsOfUse}
                onChange={this.updateTermsOfUse}
                name="acceptedTermsOfUse"
              />
            }
            label={<TermsOfUseLabel />}
          />
          <Button disabled={!this.canRegister()} raised color="primary" onClick={this.didClickRegisterButton} className="mt-4">
            Cadastrar
          </Button>
        </div>
      </section>
    )
  }
}

RegisterPage.contextTypes = {
  showSnack: PropTypes.func
}

const TermsOfUseLabel = () => (
  <span>
    Ao se registrar você aceita os <a href="/termos-de-uso" target="_blank" style={{textTransform: "lowercase"}}>TERMOS E CONDIÇÕES DE USO E POLÍTICA DE PRIVACIDADE</a>
  </span>
)
