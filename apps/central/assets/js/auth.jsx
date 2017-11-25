import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import apolloClient from './graphql_client'

const loginMutation = gql`
  mutation login($login: String!, $password: String!) {
    session: login(login: $login, password: $password) {
      token
    }
  }
`

const Auth = {}
Auth.token = localStorage.getItem('authToken')
Auth.loggedIn = (Auth.token || "").length > 0

Auth.login = (login, password, cb) => {
  apolloClient.mutate({
    mutation: loginMutation,
    variables: { login, password }
  }).then((res) => {
    localStorage.setItem('authToken', res.data.session.token)
    cb()
  }).catch((res) => {
    alert(res.graphQLErrors[0].message)
  })
}

export default Auth
