const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

//Call the package Http in the Node
const http = require('http');

//Call the file to have app
const app = require('./app');

//the normalizePort function returns a valid port, whether supplied as a number or a string
const normalizePort = val => { 
  const port = parseInt(val, 10); 

//the isNaN function is used to test the value NaN (represents a quantity which is not a number) here it tests the value of the port
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT);
app.set('port', port);

//the errorHandler function looks for different errors and handles them appropriately. It is then saved in the server
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//The http.createServer() method turns your computer into an HTTP server.
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => { //an event listener is also registered, logging the port or named pipe the server is running on in the console.
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
