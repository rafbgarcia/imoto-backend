import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider, addLocaleData } from 'react-intl'
import ptBR from 'react-intl/locale-data/pt'
addLocaleData(ptBR)

import Layout from './layout'
import Login from './login'
import Central from './central'

import client from './graphql_client'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

const theme = createMuiTheme({})


document.addEventListener('DOMContentLoaded', () => {
  const page = Central.loggedIn() ? <Layout /> : <Login />

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
