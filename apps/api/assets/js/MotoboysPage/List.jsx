import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper'
import AddIcon from 'material-ui-icons/Add'
import Button from 'material-ui/Button'
import { Link } from 'react-router-dom'

import MotoboyRow from './MotoboyRow'

class List extends React.Component{
  render() {
    const {motoboys, loading} = this.props.data

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
          { loading ? "Carregando..." : MotoboysTable(motoboys) }
        </div>
      </div>
    )
  }
}

const MotoboysTable = (motoboys) => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Motoboy</TableCell>
          <TableCell>Telefone</TableCell>
          <TableCell>Cadastro ativo?</TableCell>
          <TableCell>&nbsp;</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {motoboys.map(motoboy =>
          <MotoboyRow
            key={motoboy.id}
            motoboy={motoboy}
          />
        )}
      </TableBody>
    </Table>
  </Paper>
)

export default graphql(gql`query getMotoboys {
  motoboys {
    id
    name
    phoneNumber
    active
    state
  }
}`)((props) => <List {...props} />)
