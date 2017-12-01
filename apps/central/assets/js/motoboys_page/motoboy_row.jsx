import React from 'react'
import gql from 'graphql-tag'
import apolloClient from 'js/graphql_client'
import { TableCell, TableRow } from 'material-ui/Table'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import DoneIcon from 'material-ui-icons/Done'
import EditIcon from 'material-ui-icons/Edit'
import CancelIcon from 'material-ui-icons/Cancel'
import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'
import PhoneField from 'js/shared/phone_field'
import Switch from 'material-ui/Switch'
import red from 'material-ui/colors/red'

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
      <TableRow className={!motoboy.active && classes.inactiveMotoboyRow}>
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
  inactiveMotoboyRow: {
    background: red[100]
  }
})

export default withStyles(styles)(MotoboyRow)
