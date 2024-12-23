// backend/server.js
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const sequelize = require('./config/database');
const phonebookRoutes = require('./routes/phonebookRoutes');

// Import GraphQL schema dan resolvers
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// GraphQL upload middleware
app.use(graphqlUploadExpress());

// REST API routes (bisa digunakan bersamaan dengan GraphQL)
app.use('/api', phonebookRoutes);

// Fungsi untuk menginisialisasi Apollo Server
async function startApolloServer() {
  // Buat instance Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
    // Konfigurasi tambahan
    playground: process.env.NODE_ENV === 'development', // Enable GraphQL Playground di development
    introspection: true, // Enable introspection untuk development
  });

  // Start Apollo Server
  await server.start();

  // Apply middleware ke Express
  server.applyMiddleware({ 
    app,
    path: '/graphql' // Endpoint untuk GraphQL
  });

  const PORT = process.env.PORT || 3001;

  // Sync database dan start server
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`🚀 REST API endpoint: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

// Jalankan server
startApolloServer().catch(console.error);

module.exports = app;