import gql from 'graphql-tag'
import apolloClient from './graphql_client'

const loginMutation = gql`
  mutation login($login: String!, $password: String!) {
    central: login(login: $login, password: $password) {
      id
      name
      phoneNumber
      token
    }
  }
`
const logoutMutation = gql`
  mutation logout($token: String!) {
    central: logout(token: $token) {
      token
    }
  }
`

const login = (login, password, cb) => {
  apolloClient.mutate({
    mutation: loginMutation,
    variables: { login, password }
  }).then((res) => {
    cb(res.data.central)
  }).catch((res) => {
    alert(res.graphQLErrors[0].message)
  })
}

const logout = (cb) => {
  apolloClient.mutate({
    mutation: logoutMutation,
    variables: { token: Auth.currentCentral.token }
  }).then((res) => {
    cb(res.data.central)
  }).catch((res) => {
    alert(res.graphQLErrors[0].message)
  })
}

export default {
  login,
  logout,
}
