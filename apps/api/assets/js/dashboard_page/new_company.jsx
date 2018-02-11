import React from 'react'
import PropTypes from 'prop-types'
import linkState from 'linkstate';
import update from 'immutability-helper';
import gql from 'graphql-tag'
import apolloClient from 'js/graphql_client'
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField'
import AddIcon from 'material-ui-icons/Add'
import Select from 'material-ui/Select';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import Radio, { RadioGroup } from 'material-ui/Radio';

import PhoneField from 'js/shared/phone_field'
import ZipcodeField from 'js/shared/zipcode_field'
import * as validate from 'js/shared/validations'

class NewOrderModal extends React.Component {
  state = {
    companies: [],
    companyId: "",
    company: this.emptyCompany()
  }

  emptyCompany() {
    return {
      name: "",
      phoneNumber: "",
      location: {
        street: "",
        number: "",
        zipcode: "",
        complement: "",
        reference: "",
      },
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (!this.props.open && nextProps.open) {
      this.fetchMyCompanies()
    }
  }

  fetchMyCompanies() {
    const {showSnack} = this.context

    apolloClient.query({
      query: gql`query getMyCompanies {
        companies: myCompanies {
          id name phoneNumber
          location { street number neighborhood city uf zipcode complement reference }
        }
      }`,
    })
    .then(({data: {companies}}) => this.setState({companies}))
    .catch((errors) => showSnack(errors, "error"))
  }

  updateCompanyId = (evt, companyId) => {
    this.setState({ companyId })
  }

  setFieldsAs(object, value) {
    const newObj = {}
    for (let key in object) {
      if (!object[key]) newObj[key] = ""
      else newObj[key] = object[key]
    }
    return newObj
  }

  updateCompany = (evt) => {
    const changes = {[evt.target.name]: evt.target.value}
    this.setState({company: {...this.state.company, ...changes}})
  }

  updateLocation = (evt) => {
    const changes = {[evt.target.name]: evt.target.value}
    const newState = update(this.state, {
      company: {
        location: { $set: {...this.state.company.location, ...changes} }
      }
    })
    this.setState(newState)
  }

  didClickSendButton = () => {
    const {company: {id}} = this.state
    id ? this.createOrderForExistingCompany() : this.createOrderForNewCompany()
  }

  createOrderForExistingCompany() {
    const {companyId} = this.state
    const {showSnack} = this.context

    this._createOrder({
      mutation: gql`mutation createOrderForExistingCompany($companyId: ID!) {
        order: createOrderForExistingCompany(companyId: $companyId) {
          id
        }
      }`,
      variables: { companyId },
    })
  }

  createOrderForNewCompany() {
    const {company} = this.state

    this._createOrder({
      mutation: gql`mutation createOrderForNewCompany($companyParams: CompanyParams) {
        order: createOrderForNewCompany(companyParams: $companyParams) {
          id
        }
      }`,
      variables: { companyParams: company },
    })
  }

  _createOrder(mutationData) {
    const {showSnack} = this.context

    this.props.onClose()
    showSnack("Enviando pedido...")

    apolloClient.mutate(mutationData)
    .then(({data: {order}}) => showSnack("Pedido enviado, aguardando confirmação do motoboy", "success"))
    .catch((errors) => showSnack(errors, "error"))
  }

  canEdit = () => {
    return this.state.companyId.length > 0
  }

  canSendOrder() {
    const {company} = this.state
    return validate.notBlank(company.name)
  }

  render({}, {companyId, companies}) {
    const {open, onClose} = this.props
    const {company} = this.state

    return (
      <Modal
        open={open}
        onClose={onClose}
        style={modalStyles()}
      >
        <div style={innerDivStyles()}>
          <h3 className="mb-4">Nova entrega</h3>

          <FormControl component="fieldset" required className={classes().formControl}>
            <FormLabel component="legend">Selecione a empresa</FormLabel>
            <div>
              <RadioGroup
                aria-label="company"
                name="companyId"
                value={this.state.companyId}
                onChange={this.updateCompanyId}
              >
                {companies.map(c =>
                  <FormControlLabel value={c.id} control={<Radio />} label={c.name} />
                )}
              </RadioGroup>
            </div>
          </FormControl>

          <div className="mt-5 text-center">
            <Button disabled={!this.canSendOrder()} variant="raised" color="primary" onClick={this.didClickSendButton}>
              <AddIcon className="mr-2" />
              Enviar entrega
            </Button>
            <FormHelperText className="text-center mt-2">Obs: a entrega será enviada para o próximo motoboy</FormHelperText>
          </div>
        </div>
      </Modal>
    )
  }
}

class NewCompanyFields extends React.Component {
  render({}, {}) {
    return (
      <div>
        <Typography type="title" className="mb-2 mt-4">Dados da empresa</Typography>
        <section className={classes().formControlFlex}>
          <FormControl className="w-50 mr-4">
            <TextField
              label="* Nome da empresa"
              onChange={this.updateCompany}
              name="name"
              value={company.name}
              disabled={this.canEdit()}
            />
          </FormControl>

          <FormControl className="w-50">
            <PhoneField
              label="Telefone"
              name="phoneNumber"
              onChange={this.updateCompany}
              value={company.phoneNumber}
              disabled={this.canEdit()}
            />
          </FormControl>
        </section>

        <Typography type="title" className="mb-2 mt-5">Endereço da empresa</Typography>

        <section className={classes().formControlFlex}>
          <FormControl className="w-50">
            <TextField
              label="Logradouro"
              onChange={this.updateLocation}
              name="street"
              value={company.location.street}
              disabled={this.canEdit()}
            />
          </FormControl>
          <FormControl className="w-25 mr-4 ml-4">
            <TextField
              label="Número"
              onChange={this.updateLocation}
              name="number"
              type="number"
              value={company.location.number}
              disabled={this.canEdit()}
            />
          </FormControl>
          <FormControl className="w-25">
            <TextField
              label="Complemento"
              onChange={this.updateLocation}
              name="complement"
              value={company.location.complement}
              disabled={this.canEdit()}
            />
          </FormControl>
        </section>

        <section className={classes().formControlFlex}>
          <FormControl className="w-25">
            <ZipcodeField
              label="CEP"
              onChange={this.updateLocation}
              name="zipcode"
              value={company.location.zipcode}
              disabled={this.canEdit()}
            />
          </FormControl>
          <FormControl className="w-50 ml-4">
            <TextField
              label="Ponto de referência"
              onChange={this.updateLocation}
              name="reference"
              value={company.location.reference}
              disabled={this.canEdit()}
            />
          </FormControl>
        </section>
      </div>
    )
  }
}

NewOrderModal.contextTypes = {
  showSnack: PropTypes.func
}

function classes() {
  return {
    formControl: "mb-3",
    formControlFlex: "mb-3 d-flex align-items-center",
  }
}

function modalStyles() {
  return {
    alignItems: "center",
    justifyContent: "center",
  }
}

function innerDivStyles() {
  return {
    width: "40rem",
    margin: "5rem 0 auto",
    border: '1px solid #e5e5e5',
    backgroundColor: '#fff',
    boxShadow: '0 5px 15px rgba(0, 0, 0, .5)',
    zIndex: 1,
    padding: "2rem",
  };
}

function getCompaniesOptions(companies) {
  if (!companies) {
    return <MenuItem disabled><em>Carregando empresas</em></MenuItem>
  } else if (companies.length === 0) {
    return <MenuItem disabled><em>Você ainda não tem empresas cadastradas</em></MenuItem>
  } else {
    return companies.map((company) => (
      <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
    ))
  }
}

export default NewOrderModal
