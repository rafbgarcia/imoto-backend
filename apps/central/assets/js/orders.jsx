import React from 'react'
import ReactDOM from 'react-dom'

import OrdersContainer from './orders/container'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4001/api/motoboy/graphql' }),
  cache: new InMemoryCache(),
})

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <OrdersContainer />
    </ApolloProvider>,
    document.getElementById('orders')
  )
})
