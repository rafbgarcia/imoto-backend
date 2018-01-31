import React from 'react'
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar'
import CloseIcon from 'material-ui-icons/Close'
import IconButton from 'material-ui/IconButton'

class SnackProvider extends React.Component {
  state = {
    open: false,
    messages: [""],
  }

  getChildContext() {
    return {
      showSnack: (messages) => { this.setState({open: true, messages}) }
    }
  }

  close = () => {
    this.setState({open: false, messages: [""]})
  }

  render() {
    const {open, messages} = this.state

    return (
      <div>
        {this.props.children}
        <Snack open={open} messages={messages} onClose={this.close} />
      </div>
    )
  }
}

SnackProvider.childContextTypes = {
  showSnack: PropTypes.func,
}

class Snack extends React.Component {
  render() {
    const {open, messages, onClose} = this.props

    return (
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        open={open}
        autoHideDuration={5000}
        onClose={onClose}
        SnackbarContentProps={{'aria-describedby': 'message-id'}}
        message={formatMessages(messages)}
        action={[
          <IconButton key="close" color="inherit" onClick={onClose}>
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

export default SnackProvider
