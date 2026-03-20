// Apollo Client with Mock Link
// Uses a custom ApolloLink that resolves operations against
// the local mock resolvers, simulating a real GraphQL server.
// When a real backend is ready, replace `mockLink` with `HttpLink` GraphQL endpoint.

import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Observable,
} from "@apollo/client";
import { resolvers } from "./resolvers";

// Simulated network latency in ms (set to 0 for instant responses)
const MOCK_LATENCY_MS = 300;

// Custom ApolloLink that intercepts every operation,
// looks up the matching mock resolver by operation name,
// and returns the resolved data as an Observable.
const mockLink = new ApolloLink((operation) => {
  return new Observable((observer) => {
    const operationName = operation.operationName;

    const handle = setTimeout(() => {
      if (!operationName || !resolvers[operationName]) {
        observer.error(
          new Error(
            `No mock resolver for operation: "${operationName ?? "anonymous"}". ` +
              `Available: ${Object.keys(resolvers).join(", ")}`,
          ),
        );
        return;
      }

      try {
        const data = resolvers[operationName]() as Record<string, unknown>;
        observer.next({ data });
        observer.complete();
      } catch (err) {
        observer.error(
          err instanceof Error ? err : new Error("Internal resolver error"),
        );
      }
    }, MOCK_LATENCY_MS);

    // Cleanup on unsubscribe
    return () => clearTimeout(handle);
  });
});

// Uses `mockLink` for local development (no server needed).
// Swap `mockLink` with `new HttpLink({ uri: "/graphql" })` for production.
export const apolloClient = new ApolloClient({
  link: mockLink,
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
