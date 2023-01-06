import { FastifyReply } from 'fastify';
import HttpStatus from 'http-status';
import { RequestWithUser } from '../interfaces/request';
import { TournamentService } from '../services';

export async function getTournaments(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    const { page, limit } = request.query;
    reply.code(HttpStatus.OK).send(await TournamentService.getTournaments(page, limit));
}

export async function getTournamentById(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    const { id } = request.params;

    reply.code(HttpStatus.OK).send(await TournamentService.getTournamentById(id));
}

export async function getTournamentMatches(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    const { id } = request.params;
    const { page, limit, from, to } = request.query;

    reply.code(HttpStatus.OK).send(await TournamentService.getTournamentMatches({ tournamentId: id, page, limit, from, to }));
}

export async function updateTournament(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    const { id } = request.params;
    reply.code(HttpStatus.OK).send(await TournamentService.updateTournament(id, request.body));
}

export async function createTournament(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    reply.code(HttpStatus.OK).send(await TournamentService.createTournament(request.body));
}
