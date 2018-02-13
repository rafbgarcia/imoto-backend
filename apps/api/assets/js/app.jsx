import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { indigo } from "material-ui/colors"

import Layout from 'js/Layout'
import AuthenticateLayout from 'js/AuthenticateLayout'
import Central from 'js/central'
import client from 'js/graphql_client'
import SnackProvider from 'js/snack_provider'
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
        <BrowserRouter>
          <SnackProvider>
            {page}
          </SnackProvider>
        </BrowserRouter>
      </MuiThemeProvider>
    </ApolloProvider>,
    document.getElementById('js_app')
  )
})
