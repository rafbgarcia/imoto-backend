import React from 'react'
import PropTypes from 'prop-types'
import linkState from 'linkstate'
import update from 'immutability-helper'
import apolloClient from 'js/graphql_client'
import gql from 'graphql-tag'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper'
import AddIcon from 'material-ui-icons/Add'
import Button from 'material-ui/Button'
import { Link } from 'react-router-dom'
import _ from 'lodash'

import MotoboyRow from './MotoboyRow'

class List extends React.Component{
  state = {
    motoboys: null
  }

  componentWillMount() {
    apolloClient.query({
      query: gql`query getMotoboys($onlyActive: Boolean) {
        motoboys(onlyActive: $onlyActive) {
          id
          name
          phoneNumber
          active
          state
        }
      }`,
      variables: { onlyActive: false }
    })
    .then(({data}) => data.motoboys)
    .then((motoboys) => this.setState({ motoboys: _.cloneDeep(motoboys) }))
  }

  toggleState = (index) => {
    const {showSnack} = this.context
    const {motoboys} = this.state

    const currentState = motoboys[index].state
    const newState = currentState == "available" ? "unavailable" : "available"
    this.setState({motoboys: update(motoboys, {
      [index]: {state: {$set: newState}}
    })})

    showSnack("Salvando...")

    apolloClient.mutate({
      mutation: gql`
        mutation toggleMotoboyState($id: ID!) {
          motoboy: toggleMotoboyState(id: $id) {
            id state
          }
        }
      `,
      variables: { id: motoboys[index].id },
    })
    .then(({data}) => data.motoboy)
    .then(({state}) => {
      showSnack("Motoboy atualizado!", "success")
    })
    .catch((errors) => {
      this.setState({motoboys: update(motoboys, {
        [index]: {state: {$set: currentState}}
      })})

      showSnack(errors, "error")
    })
  }

  render() {
    const {motoboys} = this.state

    return (
      <div>
        <section className="text-muted fz-80 mb-3">
          Motoboys
        </section>

        <header className="mb-5 d-flex align-items-start justify-content-between">
          <h3>
            Motoboys
            {motoboys && <span className="ml-2 badge badge-secondary">{motoboys.length}</span>}
          </h3>

          <Link to="/central/motoboys/novo" className="mr-4">
            <Button variant="raised" color="primary">
              <AddIcon className="mr-2" />
              Novo motoboy
            </Button>
          </Link>
        </header>

        <div>
          { !motoboys ? "Carregando..." : MotoboysTable(motoboys, this.toggleState) }
        </div>
      </div>
    )
  }
}

const MotoboysTable = (motoboys, toggleState) => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Motoboy</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Telefone</TableCell>
          <TableCell>&nbsp;</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {motoboys.map((motoboy, i) =>
          <MotoboyRow
            key={motoboy.id}
            motoboy={motoboy}
            index={i}
            toggleState={toggleState}
          />
        )}
      </TableBody>
    </Table>
  </Paper>
)

List.contextTypes = {
  showSnack: PropTypes.func
}

export default List
