import gql from 'graphql-tag'
import apolloClient from './graphql_client'

const loginMutation = gql`
  mutation login($login: String!, $password: String!) {
    company: login(login: $login, password: $password) {
      id
      name
      phoneNumber
      token
      locations { line1 }
      centrals { id name phoneNumber}
    }
  }
`
const logoutMutation = gql`
  mutation logout($token: String!) {
    company: logout(token: $token) {
      token
    }
  }
`

const login = (login, password, cb) => {
  apolloClient.mutate({
    mutation: loginMutation,
    variables: { login, password }
  }).then((res) => {
    cb(res.data.company)
  }).catch((res) => {
    alert(res.graphQLErrors[0].message)
  })
}

const logout = (token, cb) => {
  apolloClient.mutate({
    mutation: logoutMutation,
    variables: { token }
  }).then((res) => {
    cb(res.data.company)
  }).catch((res) => {
    alert(res.graphQLErrors[0].message)
  })
}

export default {
  login,
  logout,
}
