import React from 'react'
import gql from 'graphql-tag'
import apolloClient from 'js/graphql_client'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper'
import _ from 'lodash'

import Central from 'js/central'
import PhoneField from 'js/shared/phone_field'
import MotoboyRow from './motoboy_row'
import NewMotoboyForm from './new_motoboy_form'

export default class MotoboysPage extends React.Component{
  state = {
    motoboys: [],
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

  pushNewMotoboy = (motoboy) => {
    this.setState({ motoboys: this.state.motoboys.concat(motoboy) })
  }

  displaySnack = (message) => {
    this.setState({ showSnack: true, snackMessages: message })
  }

  render() {
    const {snackMessages, showSnack} = this.state
    const motoboys = _.sortBy(_.cloneDeep(this.state.motoboys), 'name')

    return (
      <div className="row">
        <div className="col-sm-4">
          <NewMotoboyForm onCreate={this.pushNewMotoboy} />
        </div>

        <div className="col-sm-8">
          {MotoboysTable(motoboys, this.displaySnack)}
        </div>
      </div>
    )
  }
}

const MotoboysTable = (motoboys, displaySnack) => (
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
            displaySnack={displaySnack}
          />
        )}
      </TableBody>
    </Table>
  </Paper>
)
