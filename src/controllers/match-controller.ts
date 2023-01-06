import { FastifyReply } from 'fastify';
import HttpStatus from 'http-status';
import { RequestWithUser } from '../interfaces/request';
import { MatchService } from '../services';

export async function getMatches(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    const { page, limit, from, to } = request.query;
    reply.code(HttpStatus.OK).send(await MatchService.getMatches({ page, limit, from, to }));
}

export async function getMatchById(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    const { id } = request.params;

    reply.code(HttpStatus.OK).send(await MatchService.getMatchById(id));
}

export async function updateMatch(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    const { id } = request.params;
    reply.code(HttpStatus.OK).send(await MatchService.updateMatch(id, request.body));
}

export async function createMatch(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    reply.code(HttpStatus.OK).send(await MatchService.createMatch(request.body));
}

export async function getMatchesCountInRange(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    let { from, to } = request.query;
    reply.code(HttpStatus.OK).send(await MatchService.getMatchesCountInRange(from, to));
}

export async function deleteMatch(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    const { id } = request.params;

    reply.code(HttpStatus.OK).send(await MatchService.deleteMatch(id));
}