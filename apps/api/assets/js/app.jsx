import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider, addLocaleData } from 'react-intl'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { indigo } from "material-ui/colors"
import ptBR from 'react-intl/locale-data/pt'
addLocaleData(ptBR)

import Layout from './Layout'
import AuthenticateLayout from './AuthenticateLayout'
import Central from './central'
import client from './graphql_client'
import SnackProvider from './snack_provider'

import config from 'js/config'

const theme = createMuiTheme({
  palette: {
    // Logo color: #074C8C
    primary: indigo,
  },
})

config.startSentry()

document.addEventListener('DOMContentLoaded', () => {
  const page = Central.loggedIn() ? <Layout /> : <AuthenticateLayout />

  ReactDOM.render(
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={theme}>
        <IntlProvider locale="pt">
          <BrowserRouter>
            <SnackProvider>
              {page}
            </SnackProvider>
          </BrowserRouter>
        </IntlProvider>
      </MuiThemeProvider>
    </ApolloProvider>,
    document.getElementById('js_app')
  )
})
