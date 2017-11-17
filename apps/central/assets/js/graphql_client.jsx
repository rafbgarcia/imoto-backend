import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context';

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: "unimoto-token",
    }
  }
});
const httpLink = authLink.concat(new HttpLink({
  uri: 'http://104.131.89.232:4001/api/central/graphql'
}))

export default new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})
