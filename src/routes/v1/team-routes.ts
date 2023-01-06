import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import Joi from 'joi';
import { TeamController } from '../../controllers';
import { getBasedSchema } from './schema';

export default function routes(fastify: FastifyInstance, opts: FastifyPluginOptions, done: (err?: Error) => void): void {
    const basedSchema = (includeSecurity = true) => getBasedSchema('Teams', includeSecurity);

    fastify.get(
        '/teams',
        {
            schema: {
                ...basedSchema(false),
                querystring: Joi.object({
                    limit: Joi.number().min(1).default(10),
                    page: Joi.number().min(0).default(0),
                }).required(),
                summary: 'Get teams',
            },
        },
        TeamController.getTeams
    );

    fastify.get(
        '/teams/:id',
        {
            schema: {
                ...basedSchema(false),
                params: Joi.object({
                    id: Joi.number().required(),
                }).required(),
                summary: 'Get team by id',
            },
        },
        TeamController.getTeamById
    );

    fastify.post(
        '/teams',
        {
            schema: {
                ...basedSchema(false),
                body: Joi.object({
                    name: Joi.string().required(),
                    logo: Joi.string().required(),
                }).required(),
                summary: 'Create team',
            },
        },
        TeamController.createTeam
    );

    fastify.put(
        '/teams/:id',
        {
            schema: {
                ...basedSchema(false),
                params: Joi.object({
                    id: Joi.number().required(),
                }).required(),
                body: Joi.object({
                    name: Joi.string(),
                    logo: Joi.string(),
                }).required(),
                summary: 'Update team',
            },
        },
        TeamController.updateTeam
    );

    done();
}
