import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'

import Main from './main'
import client from './graphql_client'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <MuiThemeProvider>
        <Main />
      </MuiThemeProvider>
    </ApolloProvider>,
    document.getElementById('js_app')
  )
})
