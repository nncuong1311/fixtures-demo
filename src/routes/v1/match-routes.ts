import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { EMatchState } from '../../interfaces/model';
import Joi from 'joi';
import { MatchController } from '../../controllers';
import { getBasedSchema } from './schema';

export default function routes(fastify: FastifyInstance, opts: FastifyPluginOptions, done: (err?: Error) => void): void {
    const basedSchema = (includeSecurity = true) => getBasedSchema('Matches', includeSecurity);

    fastify.get(
        '/matches',
        {
            schema: {
                ...basedSchema(false),
                querystring: Joi.object({
                    limit: Joi.number().min(1).default(10),
                    page: Joi.number().min(0).default(0),
                    from: Joi.string(),
                    to: Joi.string(),
                }).required(),
                summary: 'Get matches',
            },
        },
        MatchController.getMatches
    );

    fastify.get(
        '/matches/:id',
        {
            schema: {
                ...basedSchema(false),
                params: Joi.object({
                    id: Joi.number().required(),
                }).required(),
                summary: 'Get match by id',
            },
        },
        MatchController.getMatchById
    );

    fastify.post(
        '/matches',
        {
            schema: {
                ...basedSchema(false),
                body: Joi.object({
                    tournament_id: Joi.number().required(),
                    home_team_id: Joi.number().required(),
                    away_team_id: Joi.number().required(),
                    home_team_score: Joi.number(),
                    away_team_score: Joi.number(),
                    start_at: Joi.string().required(),
                }).required(),
                summary: 'Create match',
            },
        },
        MatchController.createMatch
    );

    fastify.put(
        '/matches/:id',
        {
            schema: {
                ...basedSchema(false),
                params: Joi.object({
                    id: Joi.number().required(),
                }).required(),
                body: Joi.object({
                    tournament_id: Joi.number(),
                    home_team_id: Joi.number(),
                    away_team_id: Joi.number(),
                    home_team_score: Joi.number(),
                    away_team_score: Joi.number(),
                    state: Joi.number().valid(EMatchState.NotStartedYet, EMatchState.HaftTime, EMatchState.FullTime),
                    start_at: Joi.string(),
                }).required(),
                summary: 'Update match',
            },
        },
        MatchController.updateMatch
    );

    fastify.get(
        '/matches/calendar',
        {
            schema: {
                ...basedSchema(false),
                querystring: Joi.object({
                    from: Joi.string().required(),
                    to: Joi.string().required(),
                }).required(),
                summary: 'Get matches count for calendar',
            },
        },
        MatchController.getMatchesCountInRange
    );

    fastify.delete(
        '/matches/:id',
        {
            schema: {
                ...basedSchema(false),
                params: Joi.object({
                    id: Joi.number().required(),
                }).required(),
                summary: 'Delete match by id',
            },
        },
        MatchController.deleteMatch
    );

    done();
}
