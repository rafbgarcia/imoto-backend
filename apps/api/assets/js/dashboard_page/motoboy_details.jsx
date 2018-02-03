import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { CircularProgress } from 'material-ui/Progress';
import Modal from 'material-ui/Modal';
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table';
import {FormattedDate} from 'react-intl'

function MotoboyDetails({motoboy, open, handleClose, data: {entries, loading}}) {
  return (
    <Modal
      open={open}
      onClose={() => handleClose()}
      style={modalStyles()}
    >
      <div style={innerDivStyles()}>
        <h5>{motoboy.name} - histórico de hoje</h5>
        {Entries(entries, loading)}
      </div>
    </Modal>
  )
}

function Entries(entries, loading) {
  if (loading) {
    return (<CircularProgress size={30} />)
  }
  if (entries.length === 0) {
    return (<span>Nenhuma atividade</span>)
  }
  return (
    <Table>
      <TableBody>
        {entries.map(Entry)}
      </TableBody>
    </Table>
  )
}

function Entry(entry, index) {
  return (
    <TableRow hover key={index}>
      <TableCell>{entryText(entry)}</TableCell>
      <TableCell>
        <FormattedDate
          value={entry.insertedAt}
          hour="numeric"
          minute="numeric"
        />h
      </TableCell>
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

function modalStyles() {
  return {
    alignItems: "center",
    justifyContent: "center",
  }
}

function innerDivStyles() {
  return {
    width: "40rem",
    margin: "5rem 0 auto",
    border: '1px solid #e5e5e5',
    backgroundColor: '#fff',
    boxShadow: '0 5px 15px rgba(0, 0, 0, .5)',
    zIndex: 1,
    padding: "2rem",
  };
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
      variables: { motoboyId: id},
    }
  }
})(MotoboyDetails)
