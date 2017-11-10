import React from 'react'
import ReactDOM from 'react-dom'

import OrdersContainer from './orders/container'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'


// Socket
import {ApolloLink} from "apollo-link";
import {hasSubscription} from "@jumpn/utils-graphql";

import * as AbsintheSocket from "@absinthe/socket";
import {createAbsintheSocketLink} from "@absinthe/socket-apollo-link";
import {Socket as PhoenixSocket} from "phoenix";

const absintheSocketLink = createAbsintheSocketLink(AbsintheSocket.create(
  new PhoenixSocket("ws://localhost:4001/socket", {params: { centralId: "2" }})
));

const link = new ApolloLink.split(
  operation => hasSubscription(operation.query),
  absintheSocketLink,
  new HttpLink({ uri: 'http://localhost:4001/api/motoboy/graphql' })
);

// Client

const client = new ApolloClient({
  link: link,
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
