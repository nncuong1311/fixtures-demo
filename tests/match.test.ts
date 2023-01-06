import request from 'supertest';
import moment from 'moment';
import _ from 'lodash';
import { EMatchState, MatchesCountByDate } from '../src/interfaces/model';
import fastify from '../src/app';
import * as Utils from './utils/utils';
import { Match } from '../src/models/match-model';

const server = fastify.server;

describe('Matches', () => {
    let teamAId: number;
    let teamBId: number;
    let tournamentId: number;
    let match: Match;

    beforeAll(async () => {
        await Utils.truncateDb();
        await fastify.ready();

        let tournament = await Utils.Tournament.create(server, {
            name: 'EPL',
            logo: 'epl.png',
        });
        tournamentId = tournament.id;

        let teamA = await Utils.Team.create(server, {
            name: 'Manchester United',
            logo: 'mu.png',
        });
        teamAId = teamA.id;

        let teamB = await Utils.Team.create(server, {
            name: 'Arsenal',
            logo: 'ar.png',
        });
        teamBId = teamB.id;
    });

    describe('POST /v1/matches', () => {
        beforeAll(async () => {

        });

        it('should not be possible to create match with empty payload', async () => {
            const res = await request(server)
                .post(`/v1/matches`)
                .send();

            expect(res.statusCode).toEqual(500);
        });

        it('should not be possible to create match with invalid payload', async () => {
            const res = await request(server)
                .post(`/v1/matches`)
                .send({
                    home_team_id: teamAId,
                });

            expect(res.statusCode).toEqual(500);
        });

        it('should be possible to create match with valid payload', async () => {
            let today = moment().toISOString();
            const res = await request(server)
                .post(`/v1/matches`)
                .send({
                    home_team_id: teamAId,
                    away_team_id: teamBId,
                    tournament_id: tournamentId,
                    start_at: today,
                });

            expect(res.statusCode).toEqual(200);

            const match: Match = res.body;

            expect(match.id).not.toBeUndefined();
            expect(match.home_team_id).toEqual(teamAId);
            expect(match.away_team_id).toEqual(teamBId);
            expect(match.tournament_id).toEqual(tournamentId);
            expect(match.home_team_score).toBeUndefined();
            expect(match.away_team_score).toBeUndefined();
            expect(match.state).toEqual(EMatchState.NotStartedYet);
            expect(match.start_at).toEqual(today);
        });
    });

    describe('GET /v1/matches', () => {
        const limit = 1;
        let paginationPage = 0;

        beforeAll(async () => {
            await Utils.Match.create(server, {
                home_team_id: teamBId,
                away_team_id: teamAId,
                tournament_id: tournamentId,
                start_at: new Date(),
            });
        });

        it('should not be possible to get matches with invalid params', async () => {
            const res = await request(server)
                .get(`/v1/matches`)
                .query({
                    limit: 'abc',
                })
                .send();

            expect(res.statusCode).toEqual(500);
        });

        it('should be possible to get posts with valid param', async () => {
            const res = await request(server)
                .get(`/v1/matches`)
                .query({ limit, page: paginationPage })
                .send();

            expect(res.statusCode).toEqual(200);

            const matches: Match[] = res.body.items;
            expect(matches.length).toEqual(limit);

            const match = matches[0];
            expect(match.id).not.toBeUndefined();
            expect(match.home_team_id).not.toBeUndefined();
            expect(match.away_team_id).not.toBeUndefined();
            expect(match.tournament_id).not.toBeUndefined();
            expect(match.state).not.toBeUndefined();
            expect(match.start_at).not.toBeUndefined();

            paginationPage++;
        });

        it('should be possible to paginate matches', async () => {
            const res = await request(server)
                .get(`/v1/matches`)
                .query({ limit, page: paginationPage })
                .send();

            expect(res.statusCode).toEqual(200);

            const matches: Match[] = res.body.items;
            expect(matches.length).toEqual(limit);
        });

        it('should be possible to filter matches by date range', async () => {
            let res = await request(server)
                .get(`/v1/matches`)
                .query({ limit: 10, page: 0, from: moment().format('YYYY-MM-DD'), to: moment().format('YYYY-MM-DD') })
                .send();

            expect(res.statusCode).toEqual(200);

            let matches: Match[] = res.body.items;
            expect(matches.length).toEqual(2);

            res = await request(server)
                .get(`/v1/matches`)
                .query({ limit, page: 0, from: moment().add(2, 'day').format('YYYY-MM-DD'), to: moment().add(20, 'day').format('YYYY-MM-DD') })
                .send();

            expect(res.statusCode).toEqual(200);

            matches = res.body.items;
            expect(matches.length).toEqual(0);
        });
    });

    describe('GET /v1/matches/:id', () => {
        beforeAll(async () => {
            match = await Utils.Match.create(server, {
                home_team_id: teamAId,
                away_team_id: teamBId,
                tournament_id: tournamentId,
                start_at: moment().add(1, 'day').startOf('day').toDate(),
            });
        });

        it('should not be possible to get match with invalid id', async () => {
            const res = await request(server)
                .get(`/v1/matches/${match.id + 1}`)
                .send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(null);
        });

        it('should be possible to get posts with valid id', async () => {
            const res = await request(server)
                .get(`/v1/matches/${match.id}`)
                .send();

            expect(res.statusCode).toEqual(200);

            const matchItem: Match = res.body;
            expect(matchItem.id).toEqual(match.id);
            expect(matchItem.home_team_id).toEqual(match.home_team_id);
            expect(matchItem.away_team_id).toEqual(match.away_team_id);
            expect(matchItem.tournament_id).toEqual(match.tournament_id);
            expect(matchItem.state).toEqual(match.state);
            expect(matchItem.start_at).toEqual(match.start_at);
        });
    });

    describe('GET /v1/matches/calendar', () => {
        beforeAll(async () => {
        });

        it('should not be possible to get matches count with invalid params', async () => {
            const res = await request(server)
                .get(`/v1/matches/calendar`)
                .send();

            expect(res.statusCode).toEqual(500);
        });

        it('should be possible to get posts with valid params', async () => {
            const res = await request(server)
                .get(`/v1/matches/calendar?from=${moment().format('YYYY-MM-DD')}&to=${moment().add(1, 'month').format('YYYY-MM-DD')}`)
                .send();

            expect(res.statusCode).toEqual(200);
            const items: MatchesCountByDate[] = res.body;
            expect(items.length).toEqual(1)
            let item = items[0];
            expect(item.start_at_date).toEqual(moment().format('YYYY-MM-DD'));
            expect(item.count).toEqual(3);
        });
    });

    describe('PUT /v1/matches/:id', () => {
        it('should not be possible to update match with invalid payload', async () => {
            const res = await request(server)
                .put(`/v1/matches/${match.id}`)
                .send({
                    home_team_id: 99,
                });

            expect(res.statusCode).toEqual(400);
        });

        it('should not be possible to update match with invalid id', async () => {
            const res = await request(server)
                .put(`/v1/matches/${match.id + 99}`)
                .send({
                    home_team_id: teamBId,
                });

            expect(res.statusCode).toEqual(403);
        });

        it('should be possible to update match with valid payload', async () => {
            let today = moment().startOf('day').toISOString();
            const res = await request(server)
                .put(`/v1/matches/${match.id}`)
                .send({
                    home_team_id: teamBId,
                    away_team_id: teamAId,
                    tournament_id: tournamentId,
                    home_team_score: 1,
                    away_team_score: 0,
                    start_at: today,
                });

            expect(res.statusCode).toEqual(200);

            const matchItem: Match = res.body;

            expect(matchItem.id).not.toBeUndefined();
            expect(matchItem.home_team_id).toEqual(teamBId);
            expect(matchItem.away_team_id).toEqual(teamAId);
            expect(matchItem.tournament_id).toEqual(tournamentId);
            expect(matchItem.home_team_score).toEqual(1);
            expect(matchItem.away_team_score).toEqual(0);
            expect(matchItem.state).toEqual(EMatchState.NotStartedYet);
            expect(matchItem.start_at).toEqual(today);
        });
    });

    describe('DELETE /v1/matches/:id', () => {
        it('should not be possible to delete match with invalid id', async () => {
            const res = await request(server)
                .delete(`/v1/matches/${match.id + 99}`)
                .send();

            expect(res.statusCode).toEqual(403);
        });

        it('should be possible to delete match with valid id', async () => {
            let res = await request(server)
                .delete(`/v1/matches/${match.id}`)
                .send();

            expect(res.statusCode).toEqual(200);

            res = await request(server)
                .get(`/v1/matches/${match.id}`)
                .send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(null);
        });
    });
});
