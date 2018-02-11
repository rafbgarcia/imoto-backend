import React from 'react'
import PropTypes from 'prop-types'
import linkState from 'linkstate';
import gql from 'graphql-tag'
import apolloClient from 'js/graphql_client'
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField'
import AddIcon from 'material-ui-icons/Add'
import Select from 'material-ui/Select';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';

import PhoneField from 'js/shared/phone_field'
import ZipcodeField from 'js/shared/zipcode_field'
import * as validate from 'js/shared/validations'

export default class NewCustomerModal extends React.Component {
  state = {
    customer: this.emptyCustomer(),
    btnDisabled: false,
  }

  emptyCustomer() {
    return {
      name: "",
      phoneNumber: "",
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
      this.setState({ btnDisabled: false })
      showSnack("Cliente criado com sucesso", "success")
    })
    .catch((errors) => {
      this.setState({ btnDisabled: false })
      showSnack(errors, "error")
    })
  }

  canCreate = () => {
    const {customer, btnDisabled} = this.state
    return btnDisabled || validate.notBlank(customer.name)
  }

  render({open, onCreate}, {customer}) {
    return (
      <Modal
        open={open}
        onClose={() => onCreate()}
        style={modalStyles()}
      >
        <div style={innerDivStyles()}>
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

          <section className={classes().formControlFlex}>
            <FormControl className="w-50">
              <TextField
                label="Logradouro"
                onChange={linkState(this, 'customer.street')}
                name="street"
                value={customer.street}
              />
            </FormControl>
            <FormControl className="w-25 mr-4 ml-4">
              <TextField
                label="Número"
                onChange={linkState(this, 'customer.number')}
                name="number"
                value={customer.number}
              />
            </FormControl>
            <FormControl className="w-25">
              <TextField
                label="Complemento"
                onChange={linkState(this, 'customer.complement')}
                name="complement"
                value={customer.complement}
              />
            </FormControl>
          </section>

          <section className={classes().formControlFlex}>
            <FormControl className="w-25">
              <TextField
                label="Bairro"
                onChange={linkState(this, 'customer.neighborhood')}
                name="neighborhood"
                value={customer.neighborhood}
              />
            </FormControl>
            <FormControl className="w-25 ml-4 mr-4">
              <ZipcodeField
                label="CEP"
                onChange={linkState(this, 'customer.zipcode')}
                name="zipcode"
                value={customer.zipcode}
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
        </div>
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
    width: "40rem",
    margin: "5rem 0 auto",
    border: '1px solid #e5e5e5',
    backgroundColor: '#fff',
    boxShadow: '0 5px 15px rgba(0, 0, 0, .5)',
    zIndex: 1,
    padding: "2rem",
  };
}
