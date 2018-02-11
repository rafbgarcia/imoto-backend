import React from 'react'
import PropTypes from 'prop-types'
import linkState from 'linkstate';
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import apolloClient from 'js/graphql_client'
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField'
import SendIcon from 'material-ui-icons/Send'
import Select from 'material-ui/Select';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import Radio, { RadioGroup } from 'material-ui/Radio';

import PhoneField from 'js/shared/phone_field'
import ZipcodeField from 'js/shared/zipcode_field'
import * as validate from 'js/shared/validations'
import NewCustomerModal from './NewCustomerModal'

class NewOrderPage extends React.Component {
  state = {
    modalOpen: false,
  }

  openNewCustomerModal = () => this.setState({ modalOpen: true })

  componentWillMount() {
    this.props.data.refetch()
  }

  updateCompanyId = (evt, companyId) => {
    this.setState({ companyId })
  }

  onCreateCustomer = (success = false) => {
    success && this.props.data.refetch()
    this.setState({ modalOpen: false })
  }

  didClickSendButton = () => {
    const {companyId, motoboyId} = this.state
    const {showSnack} = this.context

    showSnack("Enviando pedido...")

    apolloClient.mutate({
      mutation: gql`mutation createOrderForExistingCompany($companyId: ID!) {
        order: createOrderForExistingCompany(companyId: $companyId) {
          id
        }
      }`,
      variables: { companyId },
    })
    .then(({data: {order}}) => {
      showSnack("Pedido enviado, aguardando confirmação do motoboy", "success")
    })
    .catch((errors) => showSnack(errors, "error"))
  }

  canSendOrder() {
    const {companyId} = this.state
    return validate.notBlank(companyId)
  }

  render(
    {data: {loading, customers, motoboys}},
    {companyId, motoboyId, modalOpen}
  ) {
    return (
      <section>
        <h3 className="mb-4">Nova entrega</h3>

        <section className="row">
          <div className="col-sm-4" role="Select the cliente">
            <Paper elevation={4}>
              <h6 className="m-0 text-muted p-3">
                Passo 1: Informe o cliente
              </h6>

              <hr className="m-0" />

              <div className="p-3">
                <Button fullWidth variant="raised" className="mb-4" onClick={this.openNewCustomerModal}>
                  Cadastrar novo cliente
                </Button>
                <div style={{overflow: "auto", maxHeight: 400}}>
                  {loading && <em className="text-muted">Carregando seus clientes, aguarde...</em>}

                  <RadioGroup
                    aria-label="company"
                    name="companyId"
                    value={this.state.companyId}
                    onChange={this.updateCompanyId}
                  >
                    {!loading && getCompaniesRadios(customers)}
                  </RadioGroup>
                </div>
              </div>
            </Paper>
          </div>

          <div className="col-sm-4">
            <Paper elevation={4}>
              <h6 className="m-0 text-muted p-3">
                Passo 2: Instruções ao motoboy
              </h6>

              <hr className="m-0" />
            </Paper>
          </div>

          <div className="col-sm-4">
            <Paper elevation={4}>
              <h6 className="m-0 text-muted p-3">
                Passo 3: Envie para o motoboy
              </h6>

              <hr className="m-0" />

              <div className="p-3">
                {/*// Selecione o Motoboy
                // Enviar para o pr'oximo da fila
                // Motoboy1
                // Motoboy2*/}

                <Button fullWidth disabled={!this.canSendOrder()} variant="raised" size="large" color="primary" onClick={this.didClickSendButton}>
                  Enviar entrega
                  <SendIcon className="ml-2" />
                </Button>
              </div>
            </Paper>
          </div>
        </section>

        <NewCustomerModal open={modalOpen} onCreate={this.onCreateCustomer} />
      </section>
    )
  }
}

NewOrderPage.contextTypes = {
  showSnack: PropTypes.func
}

function getCompaniesRadios(customers) {
  if (customers.length === 0) {
    return (
      <div>
        <p><em>Nenhum cliente.</em></p>
        <div className="alert alert-warning">
          Cadastre um novo cliente para enviar o pedido.
        </div>
      </div>
    )
  } else {
    return customers.map((company) => (
      <FormControlLabel value={company.id} control={<Radio />} label={company.name} />
    ))
  }
}

export default graphql(gql`query getMyCustomersAndMotoboys {
  customers {
    id name phoneNumber line1
  }

  motoboys {
    id name available busy unavailable
  }
}`)((props) => <NewOrderPage {...props} />)
