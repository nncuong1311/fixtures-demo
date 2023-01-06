import { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import httpStatus from 'http-status';
import { NODE_ENV } from '../config';
import { AppLogger as logger } from '../utils/logger';

export default function handleError(this: FastifyInstance, error: FastifyError, request: FastifyRequest, reply: FastifyReply): void {
    if (NODE_ENV == 'development') 
        logger.error('[Error]', error);

    reply.status(error.statusCode || (error.code && parseInt(error.code)) || httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
}
