import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/thenaursa/thena-v1',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export const dibsClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/spsina/dibs',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export default client
