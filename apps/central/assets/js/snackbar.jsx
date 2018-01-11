import React from 'react'
import Snackbar from 'material-ui/Snackbar'
import CloseIcon from 'material-ui-icons/Close'
import IconButton from 'material-ui/IconButton'

export default class Snack extends React.Component {
  state = {
    show: false,
    message: "",
  }

  show(message) {
    this.setState({
      message,
      show: true,
    })
  }

  close = () => {
    this.setState({show: false})
  }

  render() {
    const {show, message} = this.state

    return (
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        open={show}
        autoHideDuration={5000}
        onClose={this.close}
        SnackbarContentProps={{'aria-describedby': 'message-id'}}
        message={message}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.close}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    )
  }
}
