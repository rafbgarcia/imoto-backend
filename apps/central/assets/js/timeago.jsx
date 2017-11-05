import React from 'react'
import TimeAgo from 'react-timeago'
import brStrings from 'react-timeago/lib/language-strings/pt-br'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'

const formatter = buildFormatter(brStrings)

export default class Timeago extends React.Component {
  render() {
    return <TimeAgo formatter={formatter} {...this.props} />
  }
}
