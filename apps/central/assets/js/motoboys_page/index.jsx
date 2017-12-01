import React from 'react'
import gql from 'graphql-tag'
import apolloClient from 'js/graphql_client'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Switch from 'material-ui/Switch'
import Paper from 'material-ui/Paper'
import Central from 'js/central'
import _ from 'lodash'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'
import Typography from 'material-ui/Typography'

import Snack from 'js/snack'
import PhoneField from 'js/shared/phone_field'
import MotoboyRow from './motoboy_row'

export default class MotoboysPage extends React.Component{
  state = {
    motoboys: [],
    newMotoboy: {name: "", phoneNumber: ""},
    showSnack: false,
    snackMessages: [],
  }

  componentWillMount() {
    apolloClient.query({query: gql`
      query getMotoboys {
        motoboys {
          id
          name
          phoneNumber
          active
        }
      }
    `})
    .then(({data: {motoboys}}) => this.setState({motoboys}))
  }

  displaySnack = (message) => {
    this.setState({showSnack: true, snackMessages: message})
  }

  updateNewMotoboy(changes = {}) {
    const data = {...this.state.newMotoboy, ...changes}
    this.setState({newMotoboy: data})
  }

  createMotoboy = (motoboy) => {
    apolloClient.mutate({
      mutation: gql`mutation createMotoboy($params: MotoboyCreateParams) {
        motoboy: createMotoboy(params: $params) {
          id name phoneNumber active
        }
      }`,
      variables: {params: motoboy},
    })
    .then(({data: {motoboy}}) => {
      this.setState({
        motoboys: this.state.motoboys.concat(motoboy),
        newMotoboy: {name: "", phoneNumber: ""},
      })
      this.displaySnack("Motoboy adicionado!")
    })
    .catch(({graphQLErrors}) =>
      this.displaySnack(graphQLErrors.map(err => err.message))
    )
  }

  render() {
    const {newMotoboy, snackMessages, showSnack} = this.state
    const motoboys = _.sortBy(_.cloneDeep(this.state.motoboys), 'name')

    return (
      <div className="row">
        <div className="col-sm-4">
          <Typography type="headline" style={{marginBottom: 24}}>Adicionar motoboys</Typography>
          <Paper className="p-3 mb-4">
            <TextField
              label="Nome do motoboy"
              onChange={(evt) => this.updateNewMotoboy({name: evt.target.value})}
              value={newMotoboy.name}
              fullWidth
            />
            <PhoneField
              label="Telefone"
              onChange={(evt) => this.updateNewMotoboy({phoneNumber: evt.target.value})}
              value={newMotoboy.phoneNumber}
              className="mt-4 mb-4"
              fullWidth
            />
            <Button raised onClick={() => this.createMotoboy(newMotoboy)}>
              <AddIcon className="mr-2" />
              Salvar
            </Button>
          </Paper>
        </div>

        <div className="col-sm-8">
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{width: "30%"}}>Motoboy</TableCell>
                  <TableCell style={{width: "30%"}}>Telefone</TableCell>
                  <TableCell>Trabalhando para a {Central.current().name}?</TableCell>
                  <TableCell style={{width: "20%"}}>&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {motoboys.map((motoboy) =>
                  <MotoboyRow
                    key={motoboy.id}
                    motoboy={motoboy}
                    displaySnack={this.displaySnack}
                  />
                )}
              </TableBody>
            </Table>
          </Paper>
        </div>

        <Snack
          show={showSnack}
          messages={snackMessages}
          onClose={() => this.setState({showSnack: false})}
        />
      </div>
    )
  }
}

export default MotoboysPage
