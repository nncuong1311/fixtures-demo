import httpStatus from 'http-status';
import _ from 'lodash';
import { MatchModel, TournamentModel } from '../models';
import ApiError from '../classes/api-error';
import { paginate } from './pagination-service';
import { Tournament, TournamentAttributes } from '../models/tournament-model';
import { GetMatchesOptions, PaginationData } from 'interfaces/model';
import { Match } from '../models/match-model';
import * as MatchService from './match-service';

export async function getTournaments(page: number, limit: number): Promise<PaginationData<Tournament>> {
    return paginate(TournamentModel, {
        page,
        limit,
        raw: true,
        order: [['id', 'ASC']],
    });
}

export async function getTournamentById(id: number): Promise<Tournament> {
    return TournamentModel.findOne({
        where: { id },
        raw: true,
    });
}

export async function getTournamentMatches(options: GetMatchesOptions): Promise<PaginationData<Match>> {
    return MatchService.getMatches(options);
}

export async function createTournament(data: TournamentAttributes): Promise<Tournament> {
    return TournamentModel.create(data);
}

export async function updateTournament(id: string, data: TournamentAttributes): Promise<any> {
    await TournamentModel.update(
        data,
        {
            where: { id },
        }, 
    );

    let tournament = await TournamentModel.findOne({
        where: { id },
        raw: true,
    })

    if (!tournament)
        throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Tournament id');

    return tournament;
}
