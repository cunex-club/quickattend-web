import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const TOKEN = process.env.NEXT_PUBLIC_LOG_IN_TOKEN;

const httpLink = new HttpLink({
  uri: `${API_HOST}/graphql`,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
    query: {
      fetchPolicy: "cache-first",
    },
  },
});
