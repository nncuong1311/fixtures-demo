import { FastifySchema } from 'fastify';

export interface JoiSchema extends FastifySchema {
    validate: (data: any) => any;
}
