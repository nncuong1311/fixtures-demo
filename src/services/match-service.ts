import httpStatus from 'http-status';
import _ from 'lodash';
import { MatchModel, sequelize, TeamModel, TournamentModel } from '../models';
import ApiError from '../classes/api-error';
import { EMatchState, GetMatchesOptions, PaginationData } from '../interfaces/model';
import { paginate } from './pagination-service';
import { Match, MatchAttributes } from '../models/match-model';
import * as TeamService from './team-service';
import * as TournamentService from './tournament-service';
import { Op } from 'sequelize';

export async function getMatches(options: GetMatchesOptions): Promise<PaginationData<Match>> {
    let { page, limit, tournamentId, from, to } = options;

    let where: any = {};
    if (tournamentId || from || to) {
        where[Op.and] = [];

        if (tournamentId)
            where[Op.and].push({ tournament_id: tournamentId });

        if (from && to)
            where[Op.and].push(sequelize.where(sequelize.fn('DATE', sequelize.col('start_at')), {
                [Op.between]: [from, to],
            }));
    }

    return paginate(MatchModel, {
        where,
        page,
        limit,
        raw: true,
        order: [['start_at', 'DESC']],
        include: [{
            model: TeamModel,
            as: 'home_team',
        }, {
            model: TeamModel,
            as: 'away_team',
        }, {
            model: TournamentModel,
        }]
    });
}

export async function getMatchById(id: string): Promise<Match> {
    return MatchModel.findOne({
        where: { id },
        raw: true,
        include: [{
            model: TeamModel,
            as: 'home_team',
        }, {
            model: TeamModel,
            as: 'away_team',
        }, {
            model: TournamentModel,
        }]
    });
}

export async function createMatch(data: MatchAttributes): Promise<Match> {
    await verifyAttributes(data);

    data.state = EMatchState.NotStartedYet;
    return MatchModel.create(data);
}

export async function updateMatch(id: string, data: MatchAttributes): Promise<Match> {
    await verifyAttributes(data);

    await MatchModel.update(
        data,
        {
            where: { id },
        }, 
    );

    let match = await MatchModel.findOne({
        where: { id },
        raw: true,
    });

    if (!match)
        throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Match id');

    return match;
}

export async function getMatchesCountInRange(from: string, to: string): Promise<any> {
    const [results, metadata] = await sequelize.query(`
        SELECT DATE(start_at) as start_at_date, COUNT(id) as count FROM matches WHERE DATE(start_at) BETWEEN '${from}' AND '${to}'
        GROUP BY start_at_date;
    `);

    return results;
}

export async function deleteMatch(id: string): Promise<void> {
    let deletedCount = await MatchModel.destroy({
        where: { id },
    });

    if (!deletedCount)
        throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Match id');
}

async function verifyAttributes(data: MatchAttributes): Promise<void> {
    if (data.home_team_id && !await TeamService.getTeamById(data.home_team_id))
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid home team id');

    if (data.away_team_id && !await TeamService.getTeamById(data.away_team_id))
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid away team id');

    if (data.tournament_id && !await TournamentService.getTournamentById(data.tournament_id))
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid tournament id');
}