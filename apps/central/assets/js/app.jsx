import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider, addLocaleData } from 'react-intl'
import ptBR from 'react-intl/locale-data/pt'
addLocaleData(ptBR)

import Main from './main'
import client from './graphql_client'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {grey900} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    textColor: grey900,
  },
})

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={client}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <IntlProvider locale="pt">
            <Main />
          </IntlProvider>
        </MuiThemeProvider>
      </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('js_app')
  )
})
