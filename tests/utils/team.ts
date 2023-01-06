import request from 'supertest';
import { RawServerBase } from 'fastify';
import { Team, TeamAttributes } from '../../src/models/team-model';

export async function create(server: RawServerBase, team: TeamAttributes): Promise<Team> {
    const res = await request(server)
        .post(`/v1/teams`)
        .send(team);

    expect(res.statusCode).toEqual(200);
    return res.body;
}

