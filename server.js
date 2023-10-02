require('dotenv').config({ path: './config/config.env' });
const connectDatabase = require('./config/connectDatabase');

process.on('uncaughtException', (error) => {
  console.log('UNCAUGHT EXCEPTIONS: Shutting down...');
  console.log(error.name, error.message);

  process.exit(1);
});

const app = require('./app');

// Database Connection
connectDatabase();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`server is starting on http://localhost:${port}`);
});

process.on('unhandledRejection', (error) => {
  console.log('UNHANDLED REJECTION: Shutting down...');
  console.log(error.name, error.message);

  server.close(() => {
    process.exit(1);
  });
});
