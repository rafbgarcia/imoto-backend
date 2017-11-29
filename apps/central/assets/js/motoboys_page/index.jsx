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

export default class MotoboysPage extends React.Component{
  state = {
    editMode: false,
    motoboys: []
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
    `}).then(({data: {motoboys}}) => {
      this.setState({motoboys})
    })
  }

  handleChange(motoboys, index, changes = {}) {
    motoboys[index] = {...motoboys[index], ...changes}
    this.setState({motoboys})
  }

  render() {
    const {editMode} = this.state
    const motoboys = _.cloneDeep(this.state.motoboys)

    return (
      <div style={{maxWidth: 800, margin: "auto"}}>
        <div className="d-flex align-items-center justify-content-end mb-3">
          <Button raised color="default" onClick={() => this.setState({editMode: !editMode})}>
            {editMode ? "Cancelar" : "Editar motoboys"}
          </Button>

          {editMode &&
            <Button raised color="primary" onClick={() => this.setState({editMode: !editMode})} className="ml-3">
              Salvar motoboys
            </Button>}
        </div>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{width: "35%"}}>Motoboy</TableCell>
                <TableCell style={{width: "35%"}}>Telefone</TableCell>
                <TableCell>Trabalhando para a {Central.current().name}?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {motoboys.map((motoboy, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {editMode ? <TextField
                      label={false}
                      placeholder="Nome do motoboy"
                      onChange={(evt) => this.handleChange(motoboys, i, {name: evt.target.value})}
                      value={motoboy.name}
                      margin="normal"
                      fullWidth
                    /> : motoboy.name}
                  </TableCell>
                  <TableCell>
                    {editMode ? <TextField
                      label={false}
                      placeholder="Telefone"
                      onChange={(evt) => this.handleChange(motoboys, i, {phoneNumber: evt.target.value})}
                      value={motoboy.phoneNumber}
                      margin="normal"
                      fullWidth
                    /> : motoboy.phoneNumber}
                  </TableCell>
                  <TableCell>
                   {editMode ? <Switch
                      checked={motoboy.active}
                      onChange={() => this.handleChange(motoboys, i, {active: !motoboy.active})}
                      aria-label="Ativo?"
                    /> : (motoboy.active ? "Sim" : "Não")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}
