import React from 'react'
import gql from 'graphql-tag'
import apolloClient from 'js/graphql_client'
import Typography from 'material-ui/Typography'
import AddIcon from 'material-ui-icons/Add'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import PhoneField from 'js/shared/phone_field'

export default class NewMotoboyForm extends React.Component {
  state = {
    newMotoboy: {name: "", phoneNumber: ""},
  }

  updateNewMotoboy(changes = {}) {
    this.setState({newMotoboy: {...this.state.newMotoboy, ...changes}})
  }

  createMotoboy = (motoboy) => {
    const {displaySnack, onCreate} = this.props

    apolloClient.mutate({
      mutation: gql`mutation createMotoboy($params: MotoboyCreateParams) {
        motoboy: createMotoboy(params: $params) {
          id name phoneNumber active
        }
      }`,
      variables: {params: motoboy},
    })
    .then(({data: {motoboy}}) => {
      this.setState({ newMotoboy: {name: "", phoneNumber: ""}})
      displaySnack("Motoboy adicionado!")

      onCreate(motoboy)
    })
    .catch(({graphQLErrors}) =>
      displaySnack(graphQLErrors.map(err => err.message))
    )
  }

  render() {
    const {newMotoboy} = this.state

    return (
      <Paper className="p-4">
        <Typography type="headline" style={{marginBottom: 24}}>
          Adicionar novos motoboys
        </Typography>
        <TextField
          label="Nome do motoboy"
          onChange={(evt) => this.updateNewMotoboy({name: evt.target.value})}
          value={newMotoboy.name}
          fullWidth
        />
        <PhoneField
          label="Telefone"
          onChange={(evt) => this.updateNewMotoboy({phoneNumber: evt.target.value})}
          value={newMotoboy.phoneNumber}
          className="mt-4 mb-5"
          fullWidth
        />
        <div className="text-right">
          <Button raised onClick={() => this.createMotoboy(newMotoboy)}>
            <AddIcon className="mr-2" />
            Salvar
          </Button>
        </div>
      </Paper>
    )
  }
}
