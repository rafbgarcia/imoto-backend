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
import CancelIcon from 'material-ui-icons/Cancel'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'

import Snack from 'js/snack'
import PhoneField from 'js/shared/phone_field'

class MotoboysPage extends React.Component{
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
    const {classes} = this.props
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
                    motoboy={motoboy}
                    classes={classes}
                    displaySnack={this.displaySnack}
                    key={motoboy.id}
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

class MotoboyRow extends React.Component {
  state = {
    editMode: false,
    motoboy: {name: "", phoneNumber: "", active: true},
    motoboyBeforeEdit: [],
  }

  componentWillMount() {
    this.setState({motoboy: this.props.motoboy})
  }

  cancelEditMode() {
    this.setState({
      motoboy: this.state.motoboyBeforeEdit,
      editMode: false,
    })
  }

  enterEditMode() {
    this.setState({
      motoboyBeforeEdit: this.state.motoboy,
      editMode: true,
    })
  }

  toggleEditMode() {
    this.state.editMode ? this.cancelEditMode() : this.enterEditMode()
  }

  updateMotoboyFields(changes = {}) {
    this.setState({motoboy: {...this.state.motoboy, ...changes}})
  }

  saveMotoboy(motoboy) {
    const {displaySnack} = this.props
    const {id, name, phoneNumber, active} = motoboy

    apolloClient.mutate({
      mutation: gql`
        mutation updateMotoboy($id: ID!, $params: MotoboyUpdateParams) {
          motoboy: updateMotoboy(id: $id, params: $params) {
            id name phoneNumber active
          }
        }
      `,
      variables: { id, params: {name, phoneNumber, active} },
    })
    .then(() => displaySnack("Motoboy atualizado!"))
    .catch((res) => {
      this.setState({
        motoboy: this.state.motoboysBeforeEdit,
        editMode: true,
      })
      displaySnack("Ops! Ocorreu")
    })

    this.setState({editMode: false})
  }

  render() {
    const {classes} = this.props
    const {motoboy, editMode} = this.state

    return (
      <TableRow>
        <TableCell>
          {editMode ? <TextField
            label={false}
            onChange={(evt) => this.updateMotoboyFields({name: evt.target.value})}
            value={motoboy.name}
            margin="normal"
            className={classes.textFieldContainer}
            InputClassName={classes.input}
            fullWidth
          /> : motoboy.name}
        </TableCell>
        <TableCell>
          {
            editMode ? <PhoneField
              label={false}
              onChange={(evt) => this.updateMotoboyFields({phoneNumber: evt.target.value})}
              value={motoboy.phoneNumber}
              InputClassName={classes.input}
              fullWidth
            />
            : motoboy.phoneNumber
          }
        </TableCell>
        <TableCell>
         {editMode ? <Switch
            checked={motoboy.active}
            onChange={(evt) => this.updateMotoboyFields({active: !motoboy.active})}
            aria-label="Ativo?"
          /> : (motoboy.active ? "Sim" : "Não")}
        </TableCell>
        <TableCell className="d-flex align-items-center justify-content-between">
          <Tooltip title={editMode ? "Cancelar" : "Editar motoboy"} placement="top">
            <IconButton className={classes.button} onClick={() => this.toggleEditMode()}>
              {editMode ? <CancelIcon /> : <EditIcon />}
            </IconButton>
          </Tooltip>

          {editMode &&
            <Tooltip title="Salvar" placement="top">
              <Button fab color="primary" onClick={() => this.saveMotoboy(motoboy)}>
                <DoneIcon />
              </Button>
            </Tooltip>
          }
        </TableCell>
      </TableRow>
    )
  }
}

const styles = theme => ({
  input: {
    fontSize: 13,
  },
  textFieldContainer: {
    margin: 0
  },
  button: {
    margin: theme.spacing.unit,
  },
})

export default withStyles(styles)(MotoboysPage)
