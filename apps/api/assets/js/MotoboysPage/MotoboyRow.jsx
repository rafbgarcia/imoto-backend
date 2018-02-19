import React from 'react'
import { TableCell, TableRow } from 'material-ui/Table'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import EditIcon from 'material-ui-icons/Edit'
import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'
import red from 'material-ui/colors/red'
import { Link } from 'react-router-dom'
import Switch from 'material-ui/Switch'

import apolloClient from 'js/graphql_client'
import PhoneField from 'js/shared/phone_field'

class MotoboyRow extends React.Component {
  render() {
    const {classes, motoboy, index, toggleState} = this.props

    return (
      <TableRow hover className={motoboy.active ? "" : classes.inactiveMotoboyRow}>
        <TableCell>
          <span className="capitalize">{motoboy.name}</span>
          <h6>
            {!motoboy.active && <span className="badge badge-danger">Inativo</span>}
          </h6>
        </TableCell>

        <TableCell>
          {formatState(motoboy.state)}
          {motoboy.state != "busy" && <Switch
            onChange={() => toggleState(index)}
            checked={motoboy.state == "available"}
          />}
        </TableCell>

        <TableCell>
          {motoboy.phoneNumber}
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
    opacity: 0.7,
    background: "#f4f4f4"
  }
})

function formatState(state) {
  if (state == "available") {
    return <span>Online</span>
  } else if (state == "unavailable") {
    return <span>Offline</span>
  } else {
    return <h6><span className="badge badge-info">Em entrega</span></h6>
  }
}

export default withStyles(styles)(MotoboyRow)
