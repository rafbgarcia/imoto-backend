import React from 'react'
import {FormattedRelative} from 'react-intl'

export default class Timeago extends React.Component {
  render() {
    const {date} = this.props
    return <FormattedRelative value={date} />
  }
}
