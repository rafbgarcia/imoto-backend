import React from 'react'
import PropTypes from 'prop-types'
import linkState from 'linkstate';
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import apolloClient from 'js/graphql_client'
import update from 'immutability-helper';
import _ from 'lodash'

import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField'
import AddIcon from 'material-ui-icons/Add'
import KeyboardArrowUpIcon from 'material-ui-icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from 'material-ui-icons/KeyboardArrowDown'
import SendIcon from 'material-ui-icons/Send'
import PlaceIcon from 'material-ui-icons/Place'
import ListIcon from 'material-ui-icons/List'
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
  state = this.initialState()

  initialState() {
    return {
      modalOpen: false,
      motoboyId: "",
      order: {
        centralCustomerId: "",
        stops: [this.newStop(0)]
      }
    }
  }

  newStop(sequence) {
    return {
      sequence,
      instructions: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      reference: "",
    }
  }

  openNewCustomerModal = () => this.setState({ modalOpen: true })

  componentWillMount() {
    this.props.data.refetch()
  }

  updateCustomerId = (evt, centralCustomerId) => {
    const {customers} = this.props.data
    const {order} = this.state

    const selectedCustomer = customers.find(customer => customer.id == centralCustomerId)

    const firstStop = _.merge(this.newStop(0), {
      instructions: "Falar com o responsável",
      street: selectedCustomer.street,
    })

    this.setState({
      order: update(order, {
        centralCustomerId: {$set: centralCustomerId},
        stops: { $splice: [
          [0, 1, firstStop]
        ]},
      })
    })
  }

  addStop = () => {
    const {order} = this.state
    this.setState({
      order: update(order, {stops: {
        $push: [this.newStop(order.stops.length)]
      }})
    })
  }

  moveStop = (stop, amount) => {
    const {order} = this.state

    const index = order.stops.findIndex(aStop => aStop.sequence == stop.sequence)
    const newSequence = order.stops[index].sequence + amount

    // Also need to move the Stop that currently has the new sequence
    const otherStopIndex = order.stops.findIndex(aStop => aStop.sequence == newSequence)
    const otherStopNewSequence = order.stops[otherStopIndex].sequence - amount

    this.setState({
      order: update(order, {stops: {
        [index]: {sequence: {$set: newSequence}},
        [otherStopIndex]: {sequence: {$set: otherStopNewSequence}},
      }})
    })
  }

  onCreateCustomer = (customer) => {
    const {order} = this.state
    customer && this.props.data.refetch()

    this.setState({
      modalOpen: false,
      order: update(order, {
        centralCustomerId: { $set: customer.id }
      })
    })
  }

  didClickSendButton = () => {
    const {order, motoboyId} = this.state
    const {showSnack} = this.context

    showSnack("Enviando pedido...")

    apolloClient.mutate({
      mutation: gql`mutation createOrder($motoboyId: ID, $params: OrderParams) {
        order: createOrder(params: $params, motoboyId: $motoboyId) {
          id
        }
      }`,
      variables: { params: order, motoboyId },
    })
    .then(({data: {order}}) => {
      this.setState(this.initialState())
      showSnack("Pedido enviado!", "success")
    })
    .catch((errors) => showSnack(errors, "error"))
  }

  canSendOrder() {
    const {order} = this.state
    return validate.notBlank(order.centralCustomerId)
  }

  render(
    {data: {loading, customers, motoboys}},
    {order, modalOpen}
  ) {
    return (
      <section>
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
                <div style={{overflow: "auto", maxHeight: 480, border: "1px solid #ddd", padding: ".3rem 1rem"}}>
                  {loading && <em className="text-muted">Carregando seus clientes, aguarde...</em>}

                  <RadioGroup
                    aria-label="centralCustomerId"
                    name="centralCustomerId"
                    value={order.centralCustomerId}
                    onChange={this.updateCustomerId}
                  >
                    {!loading && getCompaniesRadios(customers, order.centralCustomerId)}
                  </RadioGroup>
                </div>
              </div>
            </Paper>
          </div>

          <div className="col-sm-4">
            <Paper elevation={4}>
              <h6 className="m-0 text-muted p-3">
                Passo 2: Diga ao motoboy aonde ir e o que fazer
              </h6>
            </Paper>

            {_.sortBy(order.stops, "sequence").map((stop, i) =>
              <StopElement
                index={i}
                stops={order.stops}
                stop={stop}
                parent={this}
                moveStop={this.moveStop}
                disabled={validate.isBlank(order.centralCustomerId)}
              />
            )}

            <Button onClick={this.addStop} variant="raised" fullWidth className="mt-3">
              Adicionar {order.stops.length + 1}ª parada
            </Button>
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

                {/*Preço da corrida*/}

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

class StopElement extends React.Component {
  render({stops, stop, index, parent, disabled, moveStop}) {
    return (
      <Paper elevation={4} className="mt-3">
        <h6 className="m-0 text-muted p-3 d-flex align-items-center justify-content-between">
          <div>{stop.sequence + 1}ª parada</div>
          <div>
            <Tooltip title="Mover para cima">
              <Button onClick={() => moveStop(stop, -1)} disabled={stops.length == 1 || index == 0} mini className="mr-2" variant="fab"><KeyboardArrowUpIcon /></Button>
            </Tooltip>

            <Tooltip title="Mover para baixo">
              <Button onClick={() => moveStop(stop, 1)} disabled={index == stops.length - 1} mini variant="fab"><KeyboardArrowDownIcon /></Button>
            </Tooltip>
          </div>
        </h6>
        <hr className="m-0" />
        <div className="p-3">
          {disabled && <p className="mb-4 alert alert-warning"><em>Primeiro, informe o cliente...</em></p>}

          <div className="d-flex align-items-center mb-3 text-muted">
            <PlaceIcon className="mr-2" /> Localização
          </div>

          <section className="d-flex align-items-center mb-3">
            <FormControl className="w-75">
              <TextField
                label="Rua/Avenida"
                onChange={linkState(parent, `order.stops.${index}.street`)}
                value={stop.street}
                disabled={disabled}
              />
            </FormControl>
            <FormControl className="w-25 ml-3">
              <TextField
                label="Número"
                onChange={linkState(parent, `order.stops.${index}.number`)}
                value={stop.number}
                disabled={disabled}
              />
            </FormControl>
          </section>

          <section className="d-flex align-items-center mb-3">
            <FormControl className="w-50 mr-3">
              <TextField
                label="Bairro"
                onChange={linkState(parent, `order.stops.${index}.neighborhood`)}
                value={stop.neighborhood}
                disabled={disabled}
              />
            </FormControl>
            <FormControl className="w-50">
              <TextField
                label="Complemento"
                onChange={linkState(parent, `order.stops.${index}.complement`)}
                value={stop.complement}
                disabled={disabled}
              />
            </FormControl>
          </section>
          <FormControl fullWidth>
            <TextField
              label="Ponto de referência"
              onChange={linkState(parent, `order.stops.${index}.reference`)}
              value={stop.reference}
              disabled={disabled}
            />
          </FormControl>

          <div className="d-flex align-items-center mt-5 mb-3 text-muted">
            <ListIcon className="mr-2" /> Instruções
          </div>

          <FormControl fullWidth className="mb-3">
            <TextField
              label="O que fazer neste local?"
              onChange={linkState(parent, `order.stops.${index}.instructions`)}
              value={stop.instructions}
              rowsMax={4}
              disabled={disabled}
              multiline
            />
          </FormControl>
        </div>
      </Paper>
    )
  }
}

function getCompaniesRadios(customers, selectedCustomerId) {
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
    return customers.map((customer) => (
      <FormControlLabel className={customer.id == selectedCustomerId && "bg-light"} value={customer.id} control={<Radio />} label={customer.name} />
    ))
  }
}

export default graphql(gql`query getMyCustomersAndMotoboys {
  customers {
    id name phoneNumber
    street number neighborhood complement reference
  }

  motoboys {
    id name available busy unavailable
  }
}`)((props) => <NewOrderPage {...props} />)
