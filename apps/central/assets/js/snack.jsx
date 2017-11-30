import React from 'react'
import Snackbar from 'material-ui/Snackbar'
import CloseIcon from 'material-ui-icons/Close'
import IconButton from 'material-ui/IconButton'

export default class Snack extends React.Component {
  render() {
    const {show, messages, onClose} = this.props

    return (
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        open={show}
        autoHideDuration={5000}
        onRequestClose={() => onClose()}
        SnackbarContentProps={{'aria-describedby': 'message-id'}}
        message={formatMessages(messages)}
        action={[
          <IconButton key="close" color="inherit" onClick={() => onClose()}>
            <CloseIcon />
          </IconButton>,
        ]}
      />
    )
  }
}

const formatMessages = (messages) => {
  if (typeof messages === "string") {
    return messages
  } else {
    return messages.map(Err)
  }
}

const Err = (error, i) => (
  <div className="mb-2" key={i}>{error}</div>
)
