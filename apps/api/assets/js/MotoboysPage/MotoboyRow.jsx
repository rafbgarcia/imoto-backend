import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { TableCell, TableRow } from 'material-ui/Table'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import EditIcon from 'material-ui-icons/Edit'
import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'
import red from 'material-ui/colors/red'
import { Link } from 'react-router-dom'

import apolloClient from 'js/graphql_client'
import PhoneField from 'js/shared/phone_field'

class MotoboyRow extends React.Component {
  render() {
    const {classes, motoboy} = this.props

    return (
      <TableRow className={motoboy.active ? "" : classes.inactiveMotoboyRow}>
        <TableCell>
          <span className="capitalize">{motoboy.name}</span>
          {formatState(motoboy.state)}
        </TableCell>

        <TableCell>
          {motoboy.phoneNumber}
        </TableCell>

        <TableCell>
         {motoboy.active ? "Sim" : "Não"}
        </TableCell>

        <TableCell className="d-flex align-items-center justify-content-between">
          <Tooltip title="Editar motoboy" placement="top">
            <Link to={`/central/motoboys/${motoboy.id}/editar`}>
              <IconButton><EditIcon /></IconButton>
            </Link>
          </Tooltip>
        </TableCell>
      </TableRow>
    )
  }
}

const styles = theme => ({
  inactiveMotoboyRow: {
    background: red[50]
  }
})

MotoboyRow.contextTypes = {
  showSnack: PropTypes.func
}

function formatState(state) {
  if (state == "available") {
    return <div><span className="badge badge-success">Online</span></div>
  } else if (state == "unavailable") {
    return <div><span className="badge badge-secondary">Offline</span></div>
  } else {
    return <div><span className="badge badge-info">Em entrega</span></div>
  }
}

export default withStyles(styles)(MotoboyRow)
