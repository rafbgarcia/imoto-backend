import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { TableCell, TableRow } from 'material-ui/Table'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import DoneIcon from 'material-ui-icons/Done'
import EditIcon from 'material-ui-icons/Edit'
import CancelIcon from 'material-ui-icons/Cancel'
import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'
import Switch from 'material-ui/Switch'
import red from 'material-ui/colors/red'
import _ from 'lodash'

import apolloClient from 'js/graphql_client'
import PhoneField from 'js/shared/phone_field'

class MotoboyRow extends React.Component {
  state = {
    editMode: false,
    motoboyBeforeEdit: {},
    motoboy: {
      name: "",
      phoneNumber: "",
      active: true,
      state: ""
    },
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
    const {showSnack} = this.context
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
    .catch((errors) => {
      const { motoboyBeforeEdit } = this.state

      this.setState({
        motoboy: motoboyBeforeEdit,
        editMode: true,
      })
      showSnack(errors, "error")
    })

    this.setState({editMode: false})
  }

  render() {
    const {classes} = this.props
    const {motoboy, editMode} = this.state

    return (
      <TableRow className={motoboy.active ? "" : classes.inactiveMotoboyRow}>
        <TableCell>
          {editMode ? <TextField
            label={false}
            onChange={(evt) => this.updateMotoboyFields({name: evt.target.value})}
            value={motoboy.name}
            margin="normal"
            className={classes.textFieldContainer}
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
         {motoboy.busy ? <h6><span className="badge badge-warning">Em entrega</span></h6> : null}
         {
            !motoboy.busy && editMode ? <Switch
              checked={motoboy.state == "available"}
              onChange={() => this.updateMotoboyFields({state: motoboy.state == "available" ? "unavailable" : "available"})}
            />
            : !motoboy.busy && <div>
                {
                  motoboy.state == "available" ?
                  <span className="text-success">Online</span>
                  : <h6><span className="badge badge-danger">Offline</span></h6>
                }
              </div>
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
              <Button variant="fab" mini color="primary" onClick={() => this.saveMotoboy(motoboy)}>
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
    background: red[50]
  }
})


MotoboyRow.contextTypes = {
  showSnack: PropTypes.func
}

export default withStyles(styles)(MotoboyRow)
