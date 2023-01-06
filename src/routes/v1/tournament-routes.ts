import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import Joi from 'joi';
import { TournamentController } from '../../controllers';
import { getBasedSchema } from './schema';

export default function routes(fastify: FastifyInstance, opts: FastifyPluginOptions, done: (err?: Error) => void): void {
    const basedSchema = (includeSecurity = true) => getBasedSchema('Tournaments', includeSecurity);

    fastify.get(
        '/tournaments',
        {
            schema: {
                ...basedSchema(false),
                querystring: Joi.object({
                    limit: Joi.number().min(1).default(10),
                    page: Joi.number().min(0).default(0),
                }).required(),
                summary: 'Get Tournaments',
            },
        },
        TournamentController.getTournaments
    );

    fastify.get(
        '/tournaments/:id',
        {
            schema: {
                ...basedSchema(false),
                params: Joi.object({
                    id: Joi.number().required(),
                }).required(),
                summary: 'Get Tournament by id',
            },
        },
        TournamentController.getTournamentById
    );

    fastify.get(
        '/tournaments/:id/matches',
        {
            schema: {
                ...basedSchema(false),
                params: Joi.object({
                    id: Joi.number().required(),
                }).required(),
                querystring: Joi.object({
                    limit: Joi.number().min(1).default(10),
                    page: Joi.number().min(0).default(0),
                    from: Joi.string(),
                    to: Joi.string(),
                }).required(),
                summary: 'Get Tournament matches',
            },
        },
        TournamentController.getTournamentMatches
    );

    fastify.post(
        '/tournaments',
        {
            schema: {
                ...basedSchema(false),
                body: Joi.object({
                    name: Joi.string().required(),
                    logo: Joi.string().required(),
                }).required(),
                summary: 'Create Tournament',
            },
        },
        TournamentController.createTournament
    );

    fastify.put(
        '/tournaments/:id',
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
                summary: 'Update Tournament',
            },
        },
        TournamentController.updateTournament
    );

    done();
}
