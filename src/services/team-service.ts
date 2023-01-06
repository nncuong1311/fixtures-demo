import httpStatus from 'http-status';
import _ from 'lodash';
import { TeamModel } from '../models';
import ApiError from '../classes/api-error';
import { paginate } from './pagination-service';
import { Team, TeamAttributes } from '../models/team-model';
import { PaginationData } from '../interfaces/model';

export async function getTeams(page: number, limit: number): Promise<PaginationData<Team>> {
    return paginate(TeamModel, {
        page,
        limit,
        raw: true,
        order: [['id', 'ASC']],
    });
}

export async function getTeamById(id: number): Promise<Team> {
    return TeamModel.findOne({
        where: { id },
        raw: true,
    });
}

export async function createTeam(data: TeamAttributes): Promise<Team> {
    return TeamModel.create(data);
}

export async function updateTeam(id: string, data: TeamAttributes): Promise<any> {
    await TeamModel.update(
        data,
        {
            where: { id },
        }, 
    );

    let team = await TeamModel.findOne({ 
        where: { id },
        raw: true,
    });

    if (!team)
        throw new ApiError(httpStatus.FORBIDDEN, 'Invalid team id');

    return team;
}
