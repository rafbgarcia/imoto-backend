import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context';
import Central from './central'

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: Central.loggedIn() ? `Bearer ${Central.current().token}` : "",
    }
  }
});
const httpLink = authLink.concat(new HttpLink({
  uri: 'http://localhost:4000/central'
}))

export default new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: 'ignore',
    },
  }
})
