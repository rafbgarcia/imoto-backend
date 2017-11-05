import React from 'react'
import { Modal, Spinner } from 'elemental'

export default class Motoboys extends React.Component {
  state = {
    motoboys: []
  }

  componentDidMount() {
    axios.post(`/api/graphql?query=${query()}`)
      .then((res) => {
        const motoboys = res.data.data.motoboys
        this.setState({ motoboys })
      })
  }

  onSelectMotoboy = (motoboy) => {
    this.toggleModal()
  }

  render() {
    return (
      <div>
        <h4>Motoboys</h4>
        <Modal isOpen={this.props.showMotoboys} onCancel={this.toggleModal}>
          <ModalHeader text="Selecione o Motoboy desta entrega" />
          <ModalBody>
            {this.motoboys()}
          </ModalBody>
        </Modal>
      </div>
    )
  }

  motoboys() {
    const {motoboys} = this.state
    return motoboys.map((motoboy, i) => <Motoboy key={i} motoboy={motoboy} />)
  }
}

class Motoboy extends React.Component {
  render() {
    const {motoboy} = this.props

    let iconClass
    if (motoboy.available) {
      iconClass = "text-success"
    } else if (motoboy.busy) {
      iconClass = "text-warning"
    } else {
      iconClass = "text-danger"
    }

    return (
      <div>
        <i className={`fa fa-circle ${iconClass}`}></i>
        {motoboy.name}
        <Button type="primary" onClick={e => this.onSelectMotoboy(motoboy)}>Selecionar</Button>

      </div>
    )
  }
}

function query() {
  return `query getAvailableMotoboys() {
    motoboys(available: true) {
      name
      available, busy, unavailable
      lastAvailableAt, lastBusyAt
    }
  }`
}
