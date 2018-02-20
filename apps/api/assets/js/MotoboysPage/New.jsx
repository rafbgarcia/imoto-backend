import React from 'react'
import PropTypes from 'prop-types'
import linkState from 'linkstate'
import gql from 'graphql-tag'
import apolloClient from 'js/graphql_client'
import CheckIcon from 'material-ui-icons/Check'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import PhoneField from 'js/shared/phone_field'
import { Link } from 'react-router-dom'

class New extends React.Component {
  state = {
    motoboy: {
      name: "",
      phoneNumber: "",
    },
  }

  createMotoboy = (motoboy) => {
    const {showSnack} = this.context

    apolloClient.mutate({
      mutation: gql`mutation createMotoboy($params: MotoboyCreateParams) {
        motoboy: createMotoboy(params: $params) {
          id name phoneNumber active
        }
      }`,
      variables: {params: motoboy},
    })
    .then(({data: {motoboy}}) => {
      this.setState({ motoboy: {name: "", phoneNumber: ""}})

      showSnack("Motoboy adicionado!", "success")
    })
    .catch((errors) => showSnack(errors, "error"))
  }

  render() {
    const {motoboy} = this.state

    return (
      <div>
        <section className="text-muted fz-80 mb-3">
          <Link to="/central/motoboys">Motoboys</Link>
          <span className="ml-2 mr-2">></span>
          Novo
        </section>

        <h3 className="mb-4">Novo motoboy</h3>

        <Paper className="p-4" style={{width: "30rem", maxWidth: "100%"}}>
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
          <div className="d-flex align-items-center justify-content-between">
            <Button variant="raised" onClick={() => this.createMotoboy(motoboy)}>
              <CheckIcon className="mr-2" />
              Salvar
            </Button>
          </div>
        </Paper>
      </div>
    )
  }
}

New.contextTypes = {
  showSnack: PropTypes.func
}

export default New
