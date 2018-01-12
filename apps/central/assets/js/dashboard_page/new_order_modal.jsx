import React from 'react'
import PropTypes from 'prop-types'
import update from 'immutability-helper';
import gql from 'graphql-tag'
import apolloClient from 'js/graphql_client'
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField'
import AddIcon from 'material-ui-icons/Add'
import Select from 'material-ui/Select';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';

import PhoneField from 'js/shared/phone_field'
import ZipcodeField from 'js/shared/zipcode_field'

class NewOrderModal extends React.Component {
  state = {
    companies: null,
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
    .catch(({graphQLErrors}) => showSnack(graphQLErrors.map(err => err.message)))
  }

  updateCompanyId = (evt) => {
    const companyId = evt.target.value
    const {companies} = this.state

    if (companyId.length > 0) {
      let selectedCompany = companies.find((company) => company.id == companyId)
      selectedCompany = this.setFieldsAs(selectedCompany, "")
      selectedCompany.location = this.setFieldsAs(selectedCompany.location, "")

      this.setState({companyId, company: selectedCompany})
    } else {
      this.setState({companyId, company: this.emptyCompany()})
    }
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
    const {showSnack} = this.context

  }

  createOrderForNewCompany() {
    const {company} = this.state
    const {showSnack} = this.context

    this.props.onClose()
    showSnack("Enviando pedido...")

    apolloClient.mutate({
      mutation: gql`mutation createOrderForNewCompany($companyParams: CompanyParams) {
        order: createOrderForNewCompany(companyParams: $companyParams) {
          id
        }
      }`,
      variables: {companyParams: company},
    })
    .then(({data: {order}}) => showSnack("Pedido enviado, aguardando confirmação do motoboy"))
    .catch(({graphQLErrors}) => showSnack(graphQLErrors.map(err => err.message)))
  }

  render() {
    const {open, onClose} = this.props
    const {company, companyId, companies} = this.state

    return (
      <Modal
        open={open}
        onClose={onClose}
        style={modalStyles()}
      >
        <div style={innerDivStyles()}>
          <Typography type="display1" className="mb-4">Nova entrega</Typography>

          <FormControl fullWidth className={classes().formControl}>
            <InputLabel shrink>Selecione a empresa</InputLabel>
            <Select
              value={companyId}
              onChange={this.updateCompanyId}
              displayEmpty
            >
              <MenuItem value="">Criar nova empresa</MenuItem>
              {getCompaniesOptions(companies)}
            </Select>
          </FormControl>

          <Typography type="title" className="mb-2 mt-4">Dados da empresa</Typography>
          <section className={classes().formControlFlex}>
            <FormControl className="w-50 mr-4">
              <TextField
                label="Nome da empresa"
                onChange={this.updateCompany}
                name="name"
                value={company.name}
              />
            </FormControl>

            <FormControl className="w-50">
              <PhoneField
                label="Telefone"
                name="phoneNumber"
                onChange={this.updateCompany}
                value={company.phoneNumber}
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
              />
            </FormControl>
            <FormControl className="w-25 mr-4 ml-4">
              <TextField
                label="Número"
                onChange={this.updateLocation}
                name="number"
                type="number"
                value={company.location.number}
              />
            </FormControl>
            <FormControl className="w-25">
              <TextField
                label="Complemento"
                onChange={this.updateLocation}
                name="complement"
                value={company.location.complement}
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
              />
            </FormControl>
            <FormControl className="w-50 ml-4">
              <TextField
                label="Ponto de referência"
                onChange={this.updateLocation}
                name="reference"
                value={company.location.reference}
              />
            </FormControl>
          </section>

          <div className="mt-5">
            <Button raised color="primary" onClick={this.didClickSendButton}>
              <AddIcon className="mr-2" />
              Enviar entrega
            </Button>
            <FormHelperText>* A entrega será enviada para o próximo motoboy</FormHelperText>
          </div>
        </div>
      </Modal>
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
