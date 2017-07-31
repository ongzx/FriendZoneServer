import config from './config/env';
import app from './config/express';
import http from 'http';

const server = http.Server(app);

// listen on port config.port
server.listen(config.port, () => {
	console.log(`server started on port ${config.port} (${config.env})`);
});

export default server;
