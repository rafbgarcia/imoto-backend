import React from 'react'
import PropTypes from 'prop-types'
import linkState from 'linkstate'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import apolloClient from 'js/graphql_client'
import AddIcon from 'material-ui-icons/Add'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import PhoneField from 'js/shared/phone_field'
import Switch from 'material-ui/Switch'
import { Link } from 'react-router-dom'
import _ from 'lodash'

class Edit extends React.Component {
  state = {
    motoboy: {
      id: "",
      name: "",
      phoneNumber: "",
      active: "",
    }
  }

  componentWillMount() {
    const {match} = this.props

    apolloClient.query({
      query: gql`query getMotoboy($id: ID!) {
        motoboy(id: $id) {
          id
          name
          phoneNumber
          active
        }
      }`,
      variables: { id: match.params.id }
    })
    .then(({data}) => data.motoboy)
    .then((motoboy) => this.setState({ motoboy: _.cloneDeep(motoboy) }))
  }

  saveMotoboy = () => {
    const {showSnack} = this.context
    const {motoboy} = this.state
    const {id} = motoboy
    const params = _.pick(motoboy, "name", "phoneNumber", "state", "active")

    showSnack("Salvando dados...")

    apolloClient.mutate({
      mutation: gql`
        mutation updateMotoboy($id: ID!, $params: MotoboyUpdateParams) {
          motoboy: updateMotoboy(id: $id, params: $params) {
            id
          }
        }
      `,
      variables: { id, params },
    })
    .then(() => showSnack("Motoboy atualizado!", "success"))
    .catch((errors) => showSnack(errors, "error"))
  }

  render() {
    const {motoboy} = this.state

    return (
      <section className="p-4">
        <section className="text-muted fz-80 mb-3">
          <Link to="/central/motoboys">Motoboys</Link>
          <span className="ml-2 mr-2">></span>
          Editar
        </section>

        <h3 className="mb-4">Editando dados de {motoboy.name}</h3>

        <Paper className="p-4" style={{width: "30rem"}}>
          <TextField
            label="Nome do motoboy"
            onChange={linkState(this, "motoboy.name")}
            value={motoboy.name}
            fullWidth
          />
          <PhoneField
            label="Telefone com DDD"
            onChange={linkState(this, "motoboy.phoneNumber")}
            value={motoboy.phoneNumber}
            className="mt-4 mb-5"
            fullWidth
          />
          <div className="text-right">
            <Button variant="raised" onClick={this.saveMotoboy}>
              <AddIcon className="mr-2" />
              Salvar
            </Button>
          </div>
        </Paper>
      </section>
    )
  }
}

Edit.contextTypes = {
  showSnack: PropTypes.func
}

export default Edit
