import { MatchModel } from '../models';
import { Match } from '../models/match-model';
import moment from 'moment';
import { TeamService, TournamentService, MatchService } from '../services/index';
import { paginate } from '../services/pagination-service';
import { truncateDb } from '../utils/db';

describe('Pagination service', () => {
    let limit = 1;
    let page = 0;
    let matches: Match[] = [];

    beforeAll(async () => {
        await truncateDb();
        let tournament = await TournamentService.createTournament({
            name: 'EPL',
            logo: 'epl.png',
        });

        let teamA = await TeamService.createTeam({
            name: 'Manchester United',
            logo: 'mu.png',
        });

        let teamB = await TeamService.createTeam({
            name: 'Arsenal',
            logo: 'ar.png',
        });

        matches.push(await MatchService.createMatch({
            home_team_id: teamA.id,
            away_team_id: teamB.id,
            tournament_id: tournament.id,
            start_at: moment().toDate(),
        }), await MatchService.createMatch({
            home_team_id: teamA.id,
            away_team_id: teamB.id,
            tournament_id: tournament.id,
            start_at: moment().add(1, 'day').toDate(),
        }));
    });

    it('should return correct number of items as limit', async () => {
        let data = await paginate<Match>(MatchModel, {
            limit,
            page,
        });

        expect(data.items.length).toEqual(limit);
        expect(data.total).toEqual(matches.length);
    });

    it('should return correct items when fetching next page', async () => {
        let data = await paginate<Match>(MatchModel, {
            limit,
            page,
            order: [['start_at', 'DESC']],
        });

        let item = data.items[0];
        expect(item.id).toEqual(matches[1].id);

        data = await paginate<Match>(MatchModel, {
            limit,
            page: page + 1,
            order: [['start_at', 'DESC']],
        });
        expect(data.items.length).toEqual(limit);
        expect(data.total).toEqual(matches.length);
        item = data.items[0];
        expect(item.id).toEqual(matches[0].id);

        data = await paginate<Match>(MatchModel, {
            limit,
            page: page + 2,
            order: [['start_at', 'DESC']],
        });
        expect(data.items.length).toEqual(0);
        expect(data.total).toEqual(matches.length);
    });
});