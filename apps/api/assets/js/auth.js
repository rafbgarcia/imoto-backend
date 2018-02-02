import gql from 'graphql-tag'
import apolloClient from './graphql_client'

const loginMutation = gql`
  mutation login($email: String!, $password: String!) {
    central: login(email: $email, password: $password) {
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

const login = (email, password, cb, cbErr = null) => {
  apolloClient.mutate({
    mutation: loginMutation,
    variables: { email, password }
  }).then((res) => {
    cb(res.data.central)
  }).catch((res) => {
    const errors = res.graphQLErrors[0].message
    if (cbErr) cbErr(errors)
    else alert(errors)
  })
}

const logout = (token, cb) => {
  apolloClient.mutate({
    mutation: logoutMutation,
    variables: { token }
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
