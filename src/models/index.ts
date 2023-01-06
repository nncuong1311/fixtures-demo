import { BuildOptions, Model, Sequelize } from 'sequelize';
import { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } from '../config';
import { AppLogger as logger } from '../utils/logger';

import { teamFactory } from './team-model';
import { matchFactory } from './match-model';
import { tournamentFactory } from './tournament-model';


export const sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
        host: DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

export type StaticModel = typeof Model & {
    new (values?: object, options?: BuildOptions): Model;
};

export const MatchModel = matchFactory(sequelize);
export const TeamModel = teamFactory(sequelize);
export const TournamentModel = tournamentFactory(sequelize);

MatchModel.hasOne(TeamModel, {
    foreignKey: 'id',
    sourceKey: 'home_team_id',
    as: 'home_team',
});

MatchModel.hasOne(TeamModel, {
    foreignKey: 'id',
    sourceKey: 'away_team_id',
    as: 'away_team',
});

MatchModel.hasOne(TournamentModel, {
    foreignKey: 'id',
    sourceKey: 'tournament_id',
});

export async function initDatabase(): Promise<void> {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        logger.log('DB connection has been established successfully.');
    } catch (error: any) {
        logger.error('[Error] Unable to connect to the database:', error.stack);
        throw error;
    }
}
