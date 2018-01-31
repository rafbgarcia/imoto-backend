import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { CircularProgress } from 'material-ui/Progress';
import Modal from 'material-ui/Modal';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {FormattedDate} from 'react-intl'

function MotoboyDetails({motoboy, open, handleClose, data: {entries, loading}}) {
  return (
    <Modal
      open={open}
      onClose={() => handleClose()}
    >
      <h3>{motoboy.name} - hoje</h3>
      {Entries(entries, loading)}
    </Modal>
  )
}

function Entries(entries, loading) {
  if (loading) {
    return <CircularProgress size={30} />
  }
  if (entries.length === 0) {
    return (<span>Nenhuma atividade</span>)
  }
  return (
    <Table
      selectable={false}
    >
      <TableBody
        displayRowCheckbox={false}
        showRowHover={true}
      >
        {entries.map(Entry)}
      </TableBody>
    </Table>
  )
}

function Entry(entry, index) {
  return (
    <TableRow key={index}>
      <TableRowColumn>{entryText(entry)}</TableRowColumn>
      <TableRowColumn>
        <FormattedDate
          value={entry.insertedAt}
          hour="numeric"
          minute="numeric"
        />h
      </TableRowColumn>
    </TableRow>
  )
}

function entryText(entry) {
  if (entry.scope === "motoboy" && entry.orderId) {
    return (
      <span>{entry.text} #{entry.orderId}</span>
    )
  } else {
    return (
      <span>{entry.text}</span>
    )
  }
}

export default graphql(gql`query motoboyHistory($motoboyId: ID!) {
  entries: motoboyHistory(motoboyId: $motoboyId) {
    text
    scope
    orderId
    insertedAt
  }
}`, {
  options: ({motoboy: {id}}) => {
    return {
      fetchPolicy: 'network-only',
      variables: { motoboyId: id},
    }
  }
})(MotoboyDetails)
