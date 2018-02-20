import React from 'react'
import PropTypes from 'prop-types'
import linkState from 'linkstate';
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Auth from './auth'
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
      // cnpj: "",
      password: "",
      acceptedTermsOfUse: false,
    },
  }

  updateTermsOfUse = (evt) => {
    const changes = {acceptedTermsOfUse: !this.state.central.acceptedTermsOfUse}
    this.setState({central: {...this.state.central, ...changes}})
  }

  canRegister() {
    const {central: {acceptedTermsOfUse, name, email, phoneNumber, password}} = this.state
    return acceptedTermsOfUse === true && validate.notBlank(name, email, phoneNumber, password)
  }

  didClickRegisterButton = () => {
    this.setState({btnDisabled: true})

    const {central} = this.state
    const {showSnack} = this.context

    showSnack("Criando cadastro...")

    apolloClient.mutate({
      mutation: gql`mutation Register($params: CentralParams) {
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
          <h4>Dados da central</h4>

            <TextField
              label="* Nome da central"
              onChange={linkState(this, "central.name")}
              value={central.name}
              margin="normal"
              name="name"
              fullWidth
            />

            <PhoneField
              label="* Telefone da central"
              name="phoneNumber"
              margin="normal"
              onChange={linkState(this, "central.phoneNumber")}
              value={central.phoneNumber}
              fullWidth
            />

          {/*<CnpjField
            label="* CNPJ"
            name="cnpj"
            margin="normal"
            onChange={linkState(this, "central.cnpj")}
            value={central.cnpj}
            helperText="Para dar mais segurança aos clientes, checaremos se sua central realmente existe"
            fullWidth
          />*/}

          <h4 className="mt-5">Dados para login</h4>

            <TextField
              error={!validate.email(central.email)}
              label="* E-mail"
              onChange={linkState(this, "central.email")}
              value={central.email}
              name="email"
              margin="normal"
              fullWidth
            />
            <TextField
              fullWidth
              label="* Senha"
              name="password"
              onChange={linkState(this, "central.password")}
              value={central.password}
              margin="normal"
              type="password"
            />
          <FormControlLabel
            control={
              <Checkbox
                checked={central.acceptedTermsOfUse}
                onChange={linkState(this, "central.acceptedTermsOfUse")}
                name="acceptedTermsOfUse"
              />
            }
            label={<TermsOfUseLabel />}
          />
          <Button disabled={!this.canRegister()} variant="raised" color="primary" onClick={this.didClickRegisterButton} className="mt-4">
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
