import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context';
import Auth from './auth'

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: Auth.loggedIn ? `Bearer ${Auth.token}` : "",
    }
  }
});
const httpLink = authLink.concat(new HttpLink({
  uri: 'http://localhost:4001/company'
}))

export default new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})
