import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'

import Main from './main'
import client from './graphql_client'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={client}>
        <MuiThemeProvider>
          <Main />
        </MuiThemeProvider>
      </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('js_app')
  )
})
