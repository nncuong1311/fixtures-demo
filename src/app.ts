import Fastify, { FastifyInstance } from 'fastify';
import errorHandler from './plugins/error-handler';
import swagger from './plugins/swagger';
import { JoiSchema } from './interfaces/validator';
import Routes from './routes/v1';
import path from 'path';

// Init server
const server: FastifyInstance = Fastify({});

// Register public folder
server.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default '/'
});

// Generate api document by swagger
server.register(swagger);

// Generate api endpoints
server.register(Routes, { prefix: '/v1' });

server.setErrorHandler(errorHandler);

// Set api endpoint schema validator
server.setValidatorCompiler<JoiSchema>(({ schema }) => {
    return data => schema.validate(data);
});

export default server;
