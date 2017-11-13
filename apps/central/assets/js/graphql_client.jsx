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
const httpLink = authLink.concat(new HttpLink({ uri: 'http://localhost:4001/api/central/graphql' }))

export default new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})
