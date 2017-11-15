import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

function MotoboyDetails({motoboy, open, handleClose, data: {entries, loading}}) {
  return (
    <Dialog
      title={motoboy.name}
      modal={false}
      open={open}
      onRequestClose={() => handleClose()}
    >
      {Entries(entries, loading)}
    </Dialog>
  )
}

function Entries(entries, loading) {
  if (loading) {
    return <CircularProgress size={30} />
  }
  return (
    <Table>
      {/*<TableHeader>
        <TableRow>
          <TableHeaderColumn>ID</TableHeaderColumn>
          <TableHeaderColumn>Name</TableHeaderColumn>
          <TableHeaderColumn>Status</TableHeaderColumn>
        </TableRow>
      </TableHeader>*/}
      <TableBody
        displayRowCheckbox={false}
      >
        {entries.map(Entry)}
      </TableBody>
    </Table>
  )
}

function Entry(entry, index) {
  return (
    <TableRow key={index}>
      <TableRowColumn>{entry.text}</TableRowColumn>
      <TableRowColumn>{entry.insertedAt}</TableRowColumn>
    </TableRow>
  )
}

export default graphql(gql`query motoboyHistory($motoboyId: ID!) {
  entries: motoboyHistory(motoboyId: $motoboyId) {
    text
    event
    orderId
    insertedAt
  }
}`, {
  options: ({motoboy: {id}}) => {
    return {
      variables: { motoboyId: id}
    }
  }
})(MotoboyDetails)
