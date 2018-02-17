import React from 'react'
import PropTypes from 'prop-types'
import linkState from 'linkstate';
import update from 'immutability-helper';
import gql from 'graphql-tag'
import apolloClient from 'js/graphql_client'
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField'
import AddIcon from 'material-ui-icons/Add'
import PlaceIcon from 'material-ui-icons/Place'
import Select from 'material-ui/Select';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import { CircularProgress } from 'material-ui/Progress';

import PlaceSearchField from 'js/shared/PlaceSearchField'
import PhoneField from 'js/shared/phone_field'
import ZipcodeField from 'js/shared/zipcode_field'
import * as validate from 'js/shared/validations'

export default class NewCustomerModal extends React.Component {
  state = {
    customer: this.emptyCustomer(),
    btnDisabled: false,
    loadingLatLng: false,
  }

  emptyCustomer() {
    return {
      name: "",
      phoneNumber: "",
      address: "",
      googlePlaceId: "",
      lat: "",
      lng: "",

      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      zipcode: "",
      reference: "",
      city: "",
      uf: "",
    }
  }

  didClickCreateButton = () => {
    const {showSnack} = this.context
    const {customer} = this.state
    const {onCreate} = this.props

    this.setState({ btnDisabled: true })
    showSnack("Criando cliente...")

    apolloClient.mutate({
      mutation: gql`mutation createCustomer($params: CentralCustomerParams) {
        customer: createCustomer(params: $params) {
          id
        }
      }`,
      variables: { params: customer },
    })
    .then(({data: {customer}}) => {
      onCreate(customer)
      this.setState({ customer: this.emptyCustomer(), btnDisabled: false })
      showSnack("Cliente criado com sucesso", "success")
    })
    .catch((errors) => {
      this.setState({ btnDisabled: false })
      showSnack(errors, "error")
    })
  }

  canCreate = () => {
    const {customer, btnDisabled, loadingLatLng} = this.state
    return !loadingLatLng && !btnDisabled && validate.notBlank(customer.name)
  }

  placeFieldProps() {
    const {customer} = this.state

    return {
      value: customer.address,
      onChange: (address) => {
        this.setState({customer: update(this.state.customer, {
          address: {$set: address}
        })})
      },
      onSelect: (address, placeId) => {
        this.setState({
          loadingLatLng: true,
          customer: update(this.state.customer, {
            address: {$set: address},
            googlePlaceId: {$set: placeId},
          })
        })
      },
      onGeocode: (lat, lng) => {
        this.setState({
          loadingLatLng: false,
          customer: update(this.state.customer, {
            lat: {$set: `${lat}`},
            lng: {$set: `${lng}`},
          })
        })
      }
    }
  }

  render() {
    const {open, onCreate} = this.props
    const {customer, loadingLatLng} = this.state

    return (
      <Modal
        open={open}
        onClose={() => onCreate()}
        style={modalStyles()}
      >
        <form style={innerDivStyles()} onSubmit={this.didClickCreateButton}>
          <h5>Dados do cliente</h5>

          <section className={classes().formControlFlex}>
            <FormControl className="w-50 mr-4">
              <TextField
                label="* Nome"
                name="name"
                onChange={linkState(this, 'customer.name')}
                value={customer.name}
              />
            </FormControl>

            <FormControl className="w-50">
              <PhoneField
                label="Telefone"
                name="phoneNumber"
                onChange={linkState(this, 'customer.phoneNumber')}
                value={customer.phoneNumber}
              />
            </FormControl>
          </section>

          <h5 className="mb-2 mt-5">Endereço do cliente</h5>

          <div className="fz-80 alert alert-info mb-1">
            <span className="fw-500">* Exemplos de busca</span>
            <br/>
            - av brasil 580 centro foz do iguacu
            <br/>
            - banco do brasil centro foz do iguacu
          </div>
          <div className="mb-3 d-flex align-items-center justify-content-between">
            <PlaceSearchField {...this.placeFieldProps()} />
            {loadingLatLng ? <CircularProgress size={20} color="secondary" className="ml-3" /> : null }
          </div>

          <section className={classes().formControlFlex}>
            {/*<FormControl className="w-25 mr-4">
              <TextField
                label="Número"
                onChange={linkState(this, 'customer.number')}
                name="number"
                value={customer.number}
              />
            </FormControl>*/}
            <FormControl className="w-50 mr-4">
              <TextField
                label="Complemento"
                onChange={linkState(this, 'customer.complement')}
                name="complement"
                value={customer.complement}
              />
            </FormControl>
            <FormControl className="w-50">
              <TextField
                label="Ponto de referência"
                onChange={linkState(this, 'customer.reference')}
                name="reference"
                value={customer.reference}
              />
            </FormControl>
          </section>

          <div className="mt-5">
            <Button disabled={!this.canCreate()} variant="raised" color="primary" onClick={this.didClickCreateButton}>
              <AddIcon className="mr-2" />
              Cadastrar
            </Button>
          </div>
        </form>
      </Modal>
    )
  }
}


NewCustomerModal.contextTypes = {
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
    width: "80vw",
    maxWidth: "50rem",
    margin: "5rem 0 auto",
    border: '1px solid #e5e5e5',
    backgroundColor: '#fff',
    boxShadow: '0 5px 15px rgba(0, 0, 0, .5)',
    zIndex: 1,
    padding: "2rem",
  };
}
