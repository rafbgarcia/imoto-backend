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
import DoneIcon from 'material-ui-icons/Done'
import AddIcon from 'material-ui-icons/Add'
import EditIcon from 'material-ui-icons/Edit'
import Typography from 'material-ui/Typography'
import Snack from 'js/snack'

export default class MotoboysPage extends React.Component{
  state = {
    editMode: false,
    showForm: false,
    motoboysBeforeEditMode: [],
    motoboys: [],
    newMotoboy: {name: "", phoneNumber: ""},
    showSnack: false,
    errorMessages: [],
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

  handleChange(motoboys, index, changes = {}) {
    motoboys[index] = {...motoboys[index], ...changes}
    this.setState({motoboys})
  }

  handleNewMotoboyChange(changes = {}) {
    const data = {...this.state.newMotoboy, ...changes}
    this.setState({newMotoboy: data})
  }

  cancelEditMode() {
    this.setState({
      motoboys: this.state.motoboysBeforeEditMode,
      editMode: false,
    })
  }

  enterEditMode = (otherParams = {}) => {
    this.setState({
      motoboysBeforeEditMode: this.state.motoboys,
      editMode: true,
      ...otherParams,
    })
  }

  toggleEditMode = () => {
    this.state.editMode ? this.cancelEditMode() : this.enterEditMode()
  }

  createMotoboy = (motoboy) => {
    apolloClient.mutate({
      mutation: gql`mutation createMotoboy($motoboyParams: MotoboyParams) {
        motoboy: createMotoboy(motoboyParams: $motoboyParams) {
          id name phoneNumber active
        }
      }`,
      variables: {motoboyParams: motoboy},
    })
    .then(({data: {motoboy}}) => {
      this.setState({
        motoboys: this.state.motoboys.concat(motoboy),
        newMotoboy: {name: "", phoneNumber: ""},
      })
    })
    .catch(res => this.setState({
      showSnack: true,
      errorMessages: res.graphQLErrors.map(error => error.message)
    }))

    this.setState({editMode: false})
  }

  saveMotoboys = () => {
    apolloClient.mutate({
      mutation: gql``,
      variables: {},
    })
    .then(({data: {motoboys}}) => this.setState({motoboys}))
    .catch(res => this.setState({motoboys: this.state.motoboysBeforeEditMode}))

    this.setState({editMode: false})
  }

  render() {
    const {
      editMode, newMotoboy, showForm,
      errorMessages, showSnack,
    } = this.state

    const motoboys = _.sortBy(_.cloneDeep(this.state.motoboys), 'name')


    return (
      <div className="row">
        <div className="col-sm-4">
          <Typography type="headline" style={{marginBottom: 24}}>Adicionar motoboys</Typography>
          <Paper className="p-3 mb-4">
            <TextField
              label="Nome do motoboy"
              onChange={(evt) => this.handleNewMotoboyChange({name: evt.target.value})}
              value={newMotoboy.name}
              fullWidth
            />
            <TextField
              label="Telefone"
              onChange={(evt) => this.handleNewMotoboyChange({phoneNumber: evt.target.value})}
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
          <div className="d-flex align-items-center justify-content-start mb-3">
            <Button raised onClick={() => this.toggleEditMode()}>
              {!editMode && <EditIcon className="mr-2" />}
              {editMode ? "Cancelar" : "Editar motoboys"}
            </Button>
            {editMode &&
              <Button raised color="primary" onClick={() => this.saveMotoboys()} className="ml-3">
                <DoneIcon className="mr-2" />
                Salvar
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

        <Snack
          show={showSnack}
          messages={errorMessages}
          onClose={() => this.setState({showSnack: false})}
        />
      </div>
    )
  }
}
