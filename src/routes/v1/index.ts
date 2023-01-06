import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import teamRoutes from './team-routes';
import matchRoutes from './match-routes';
import tournamentRoutes from './tournament-routes';

export default function routes(fastify: FastifyInstance, opts: FastifyPluginOptions, done: (err?: Error) => void): void {
    fastify.get('/health-check', opts, async (request, reply): Promise<any> => {
        reply.send({ ok: true });
    });

    fastify.register(matchRoutes);
    fastify.register(teamRoutes);
    fastify.register(tournamentRoutes);

    done();
}
