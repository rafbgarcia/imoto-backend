import gql from 'graphql-tag'
import apolloClient from './graphql_client'

const loginMutation = gql`
  mutation login($email: String!, $password: String!) {
    company: login(email: $email, password: $password) {
      id
      name
      phoneNumber
      token
      location {
        line1
        name street number neighborhood
        zipcode city uf complement reference
      }
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

const login = (email, password, cb) => {
  apolloClient.mutate({
    mutation: loginMutation,
    variables: { email, password }
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
