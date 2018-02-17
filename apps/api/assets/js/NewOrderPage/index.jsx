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
import PlaceSearchField from 'js/shared/PlaceSearchField'

class NewOrderPage extends React.Component {
  state = this.initialState()

  initialState() {
    return {
      modalOpen: false,
      motoboyId: "next_in_queue",
      order: {
        centralCustomerId: "",
        price: "",
        stops: []
      }
    }
  }

  newStop(sequence) {
    return {
      sequence,
      immutableKey: sequence,
      instructions: "",
      address: "",
      complement: "",
      reference: "",
      googlePlaceId: "",
      lat: "",
      lng: "",
    }
  }

  openNewCustomerModal = () => {
    this.setState({ modalOpen: true })
  }

  componentWillMount() {
    this.props.data.refetch()
  }

  updateCustomerId = (centralCustomerId) => {
    const {customers} = this.props.data
    const {order} = this.state

    const selectedCustomer = customers.find(customer => customer.id == centralCustomerId)

    const firstStop = _.merge(this.newStop(0), {
      instructions: "",
      address: selectedCustomer.address || "",
      complement: selectedCustomer.complement || "",
      reference: selectedCustomer.reference || "",
      googlePlaceId: selectedCustomer.googlePlaceId || "",
      lat: selectedCustomer.lat || "",
      lng: selectedCustomer.lng || "",
    })

    this.setState({
      order: update(order, {
        centralCustomerId: {$set: centralCustomerId},
        stops: {$set: [firstStop]},
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
    this.setState({ modalOpen: false })

    if (customer) {
      this.props.data.refetch().then(() =>
        this.updateCustomerId(customer.id)
      )
    }
  }

  didClickSendButton = () => {
    const {order, motoboyId} = this.state
    const {showSnack} = this.context
    order.stops.forEach((stop) => delete stop.immutableKey)

    showSnack("Enviando pedido...")

    apolloClient.mutate({
      mutation: gql`mutation createOrder($motoboyId: ID, $params: OrderParams) {
        order: createOrder(params: $params, motoboyId: $motoboyId) {
          id inQueue
          motoboy { name }
        }
      }`,
      variables: { params: order, motoboyId },
    })
    .then(({data: {order}}) => {
      this.setState(this.initialState())
      if (order.inQueue) {
        if (order.motoboy) {
          showSnack(`Pedido na fila! Aguardando ${order.motoboy.name} ficar disponível...`, "success")
        } else {
          showSnack("Pedido na fila! Aguardando o próximo motoboy disponível", "success")
        }
      } else {
        showSnack(`Pedido enviado para ${order.motoboy.name}`, "success")
      }
    })
    .catch((errors) => showSnack(errors, "error"))
  }

  parsedOrder() {
    const {order} = this.state

    return update(order, {
      price: { $set: parseFloat(order.price) || undefined }
    })
  }

  canSendOrder() {
    const {order} = this.state
    return validate.notBlank(order.centralCustomerId)
  }

  render() {
    const {data: {loading, customers, motoboys}} = this.props
    const {order, motoboyId, modalOpen} = this.state

    const stops = _.sortBy(order.stops, "sequence").map((stop, i) => (
      <StopElement
        key={i}
        index={stop.immutableKey}
        stops={order.stops}
        stop={stop}
        parent={this}
        moveStop={this.moveStop}
      />)
    )

    return (
      <section>
        <section className="row">
          <div role="Cliente" className="col-sm-4">
            <section className="mb-4 text-muted text-center">
              <h4><span className="badge badge-info">Passo 1</span></h4>
              <h5>Informe o cliente</h5>
            </section>

            <Paper elevation={4}>
              <div className="p-3">
                <header style={{padding: ".5rem .2rem", borderBottom: "1px solid #ddd"}}>Seus clientes</header>
                <div style={{overflow: "auto", maxHeight: 360, borderBottom: "1px solid #ddd"}}>
                  {loading &&
                    <div className="pt-3 mb-3">
                      <em className="text-muted">Carregando seus clientes, aguarde...</em>
                    </div>
                  }

                  <RadioGroup
                    aria-label="centralCustomerId"
                    name="centralCustomerId"
                    value={order.centralCustomerId}
                    onChange={(evt) => this.updateCustomerId(evt.target.value)}
                  >
                    {!loading && getCompaniesRadios(customers, order.centralCustomerId)}
                  </RadioGroup>
                </div>
              </div>
            </Paper>
            <Button fullWidth variant="raised" className="mt-3" onClick={this.openNewCustomerModal}>
              Cadastrar novo cliente
            </Button>
          </div>

          <div role="Instruções" className="col-sm-4">
            <section className="mb-4 text-muted text-center">
              <h4><span className="badge badge-info">Passo 2</span></h4>
              <h5>Diga ao motoboy aonde ir e o que fazer</h5>
            </section>

            {validate.isBlank(order.centralCustomerId) &&
              <p className="mb-4 alert alert-warning"><em>Primeiro, informe o cliente...</em></p>
            }
            {validate.notBlank(order.centralCustomerId) &&
              <div>
                {stops}

                <Button onClick={this.addStop} variant="raised" fullWidth className="mt-3">
                  Adicionar {order.stops.length + 1}ª parada
                </Button>
              </div>
            }
          </div>

          <div role="Enviar para motoboy" className="col-sm-4">
            <section className="mb-4 text-muted text-center">
              <h4><span className="badge badge-info">Passo 3</span></h4>
              <h5>Envie para o motoboy</h5>
            </section>

            <Paper elevation={4}>
              <div className="p-3">
                <FormControl fullWidth className="mb-4">
                  <InputLabel htmlFor="motoboyId">Enviar para qual motoboy?</InputLabel>
                  <Select
                    value={motoboyId}
                    onChange={linkState(this, "motoboyId", "target.value")}
                    inputProps={{
                      name: 'motoboyId',
                      id: 'motoboyId',
                    }}
                    displayEmpty={true}
                  >
                    <MenuItem value="next_in_queue">
                      <em>O próximo da fila</em>
                    </MenuItem>
                    {motoboys && motoboys.map(motoboy =>
                      <MenuItem key={motoboy.id} value={motoboy.id}>{motoboy.name}</MenuItem>)
                    }
                  </Select>
                </FormControl>

                <FormControl fullWidth className="mb-4">
                  <TextField
                    label="Valor da entrega"
                    placeholder="Ex: 12"
                    onChange={linkState(this, `order.price`)}
                    value={order.price}
                    type="number"
                  />
                </FormControl>

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
  placeFieldProps() {
    const {stop, index, parent} = this.props

    return {
      value: stop.address,
      onChange: (address) => {
        parent.setState({
          order: update(parent.state.order, {
            stops: {[index]: {address: {$set: address}}}
          })
        })
      },
      onSelect: (address, placeId) => {
        parent.setState({
          order: update(parent.state.order, {
            stops: {[index]: {
              address: {$set: address},
              googlePlaceId: {$set: placeId},
            }},
          })
        })
      },
      onGeocode: (lat, lng) => {
        parent.setState({
          order: update(parent.state.order, {
            stops: {[index]: {
              lat: {$set: `${lat}`},
              lng: {$set: `${lng}`},
            }},
          })
        })
      }
    }
  }

  render() {
    const {stops, stop, index, parent, moveStop} = this.props

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
          <div className="d-flex align-items-center mb-3 text-muted">
            <PlaceIcon className="mr-2" /> Localização
          </div>

          {stop.immutableKey == 0 ? <div>{stop.address}</div> : null}

          {stop.immutableKey != 0 ? <div>
            <div className="mb-3">
              <PlaceSearchField {...this.placeFieldProps()} />
            </div>

            <section className="d-flex align-items-center mb-3">
              <FormControl className="w-50 mr-3">
                <TextField
                  label="Complemento"
                  onChange={linkState(parent, `order.stops.${index}.complement`)}
                  value={stop.complement}
                />
              </FormControl>
              <FormControl className="w-50">
                <TextField
                  label="Ponto de referência"
                  onChange={linkState(parent, `order.stops.${index}.reference`)}
                  value={stop.reference}
                />
              </FormControl>
            </section>
          </div> : null}

          <div className="d-flex align-items-center mt-5 mb-3 text-muted">
            <ListIcon className="mr-2" /> Instruções
          </div>

          <FormControl fullWidth className="mb-3">
            <TextField
              label="O que fazer neste local?"
              onChange={linkState(parent, `order.stops.${index}.instructions`)}
              value={stop.instructions}
              rowsMax={4}
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
        <p className="mt-3 text-muted"><em></em></p>
        <div className="alert alert-warning">
          <h5>Você não tem nenhum cliente</h5>
          Cadastre um novo cliente para enviar o pedido.
        </div>
      </div>
    )
  } else {
    return customers.map((customer) => (
      <FormControlLabel key={customer.id} className={customer.id == selectedCustomerId ? "bg-light" : ""} value={customer.id} control={<Radio />} label={customer.name} />
    ))
  }
}

export default graphql(gql`query getMyCustomersAndMotoboys {
  customers {
    id name phoneNumber
    address complement reference googlePlaceId lat lng
  }

  motoboys {
    id name available busy unavailable
  }
}`)((props) => <NewOrderPage {...props} />)
