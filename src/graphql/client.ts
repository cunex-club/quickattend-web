import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  Observable,
  split,
} from "@apollo/client";
import { resolvers } from "./resolvers";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const TOKEN = process.env.NEXT_PUBLIC_LOG_IN_TOKEN;

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

const httpLink = new HttpLink({
  uri: `${API_HOST}/graphql`,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

const REAL_OPERATIONS = new Set(["EventDashboardData"]);

const link = split(
  (operation) => REAL_OPERATIONS.has(operation.operationName ?? ""),
  httpLink,
  mockLink,
);

export const apolloClient = new ApolloClient({
  link,
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
