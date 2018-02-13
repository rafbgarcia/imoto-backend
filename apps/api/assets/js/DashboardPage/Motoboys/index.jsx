import React from 'react'
import ListSubheader from 'material-ui/List/ListSubheader'

import MotoboyItem from './MotoboyItem'
import History from './History'

export default class Motoboys extends React.Component {
  state = {
    open: false,
    clickedMotoboy: null,
  }

  openInfo = (motoboy) => this.setState({open: true, clickedMotoboy: motoboy})

  closeInfo = () => this.setState({open: false})

  render() {
    const {motoboys} = this.props
    const {open, clickedMotoboy} = this.state

    if (!motoboys) {
      return null
    }

    return (
      <div className="bg-light">
        <ListSubheader disableSticky>Motoboys</ListSubheader>
        {
          motoboys.map((motoboy, i) =>
            MotoboyItem(motoboy, i, () => this.openInfo(motoboy))
          )
        }

        {
          clickedMotoboy && <History
            open={open}
            motoboy={clickedMotoboy}
            handleClose={this.closeInfo}
          />
        }
      </div>
    )
  }
}
