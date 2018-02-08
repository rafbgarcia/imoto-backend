import React from 'react'
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar'
import CloseIcon from 'material-ui-icons/Close'
import IconButton from 'material-ui/IconButton'

class SnackProvider extends React.Component {
  state = {
    open: false,
    messages: null,
    messageType: "default",
  }

  getChildContext() {
    return {
      /**
       * @param String messageType "error" | "success" | "default".
       * Default "default"
       */
      showSnack: (messages, messageType = "default") =>
        this.setState({messageType, messages, open: true})
    }
  }

  close = () => {
    this.setState({open: false, messages: [""]})
  }

  render() {
    const {open, messages, messageType} = this.state

    return (
      <div>
        {this.props.children}
        <Snack open={open} messageType={messageType} messages={messages} onClose={this.close} />
      </div>
    )
  }
}

SnackProvider.childContextTypes = {
  showSnack: PropTypes.func,
}

class Snack extends React.Component {
  formattedMessages() {
    const {messages} = this.props

    if (!messages || messages == [""]) return

    if (typeof messages === "string") {
      return messages
    } else if (messages.map && typeof messages[0] === "string") {
      return messages.map((error, i) => <div key={i}>{error}</div>)
    } else if (messages.graphQLErrors && messages.graphQLErrors[0]) {
      return messages.graphQLErrors.map((error, i) => <div key={i}>{error.message}</div>)
    }
  }

  messageClass() {
    const {messageType} = this.props

    if (messageType === "success")
      return "snackbar-bg-success"
    else if (messageType === "error")
      return "snackbar-bg-danger"
    else
      return ""
  }

  render() {
    const {open, onClose, messageType} = this.props

    return (
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        open={open}
        autoHideDuration={10000}
        onClose={onClose}
        classes={{anchorTopRight: this.messageClass()}}
        SnackbarContentProps={{'aria-describedby': 'message-id'}}
        message={this.formattedMessages()}
        action={[
          <IconButton key="close" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>,
        ]}
      />
    )
  }
}

export default SnackProvider
