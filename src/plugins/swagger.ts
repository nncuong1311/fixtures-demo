import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import FastifySwagger from 'fastify-swagger';
import convert from 'joi-to-json';
import fastifyPlugin from 'fastify-plugin';

export default fastifyPlugin((fastify: FastifyInstance, opts: FastifyPluginOptions, done: (err?: Error) => void): void => {
    fastify.register(FastifySwagger, {
        swagger: {
            info: {
                title: 'Swagger',
                description: 'Testing api',
                version: '1.0.0',
            },
            securityDefinitions: {
                authorization: {
                    type: 'apiKey',
                    name: 'authorization',
                    in: 'header',
                },
            },
            consumes: ['application/json'],
            produces: ['application/json'],
        },
        transform: schema => {
            const { params = undefined, body = undefined, querystring = undefined, ...others } = schema || {};
            const transformed = { ...others };
            if (params) transformed.params = convert(params);
            if (body) transformed.body = convert(body);
            if (querystring) transformed.querystring = convert(querystring);

            return transformed;
        },
        hideUntagged: true,
        exposeRoute: true,
    });

    done();
});
