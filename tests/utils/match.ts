import request from 'supertest';
import { RawServerBase } from 'fastify';
import { Match, MatchAttributes } from '../../src/models/match-model';

export async function create(server: RawServerBase, match: MatchAttributes): Promise<Match> {
    const res = await request(server)
        .post(`/v1/matches`)
        .send(match);

    expect(res.statusCode).toEqual(200);
    return res.body;
}

