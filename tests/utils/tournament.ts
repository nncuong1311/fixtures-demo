import request from 'supertest';
import { RawServerBase } from 'fastify';
import { Tournament, TournamentAttributes } from '../../src/models/tournament-model';

export async function create(server: RawServerBase, tournament: TournamentAttributes): Promise<Tournament> {
    const res = await request(server)
        .post(`/v1/tournaments`)
        .send(tournament);

    expect(res.statusCode).toEqual(200);
    return res.body;
}

