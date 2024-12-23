import { createApp, h, provide } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import App from './App.vue'
import store from './store'

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        contacts: {
          keyArgs: ["search", "sortBy", "sortOrder"],
          merge(existing = [], incoming = [], { args = {} }) {
            const { offset = 0 } = args
            
            // If it's a fresh query (offset = 0), return just incoming
            if (!offset) return incoming

            // Merge existing contacts with new ones
            return [...existing, ...incoming]
          },
          // Read function to ensure we always return an array
          read(existing) {
            return existing || []
          }
        }
      }
    }
  }
})

const apolloClient = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
})

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App)
})

app.use(store)
app.mount('#app')