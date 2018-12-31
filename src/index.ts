require('dotenv').config();

import Server from './server';

try {
  const server: Server = new Server();
  server.start();
} catch (error) {
  console.error('SERVER ERROR');
  console.log(`Error message: ${error.message}`);
}
