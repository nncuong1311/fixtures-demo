import { FastifyReply } from 'fastify';
import HttpStatus from 'http-status';
import { RequestWithUser } from '../interfaces/request';
import { TeamService } from '../services';

export async function getTeams(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    const { page, limit } = request.query;
    reply.code(HttpStatus.OK).send(await TeamService.getTeams(page, limit));
}

export async function getTeamById(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    const { id } = request.params;

    reply.code(HttpStatus.OK).send(await TeamService.getTeamById(id));
}

export async function updateTeam(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    const { id } = request.params;
    reply.code(HttpStatus.OK).send(await TeamService.updateTeam(id, request.body));
}

export async function createTeam(request: RequestWithUser, reply: FastifyReply): Promise<any> {
    reply.code(HttpStatus.OK).send(await TeamService.createTeam(request.body));
}
