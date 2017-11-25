import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider, addLocaleData } from 'react-intl'
import ptBR from 'react-intl/locale-data/pt'
addLocaleData(ptBR)

import Dashboard from './dashboard'
import Login from './login'
import Auth from './auth'

import client from './graphql_client'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

const theme = createMuiTheme({})


document.addEventListener('DOMContentLoaded', () => {
  const page = Auth.loggedIn ? <Dashboard /> : <Login />

  ReactDOM.render(
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={theme}>
        <IntlProvider locale="pt">
          <BrowserRouter>
            {page}
          </BrowserRouter>
        </IntlProvider>
      </MuiThemeProvider>
    </ApolloProvider>,
    document.getElementById('js_app')
  )
})
