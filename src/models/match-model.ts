import { EMatchState } from '../interfaces/model';
import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface MatchAttributes {
    id?: number;
    tournament_id: number;
    home_team_id: number;
    away_team_id: number;
    home_team_score?: number;
    away_team_score?: number;
    start_at: Date;
    state?: EMatchState;
}

export interface Match extends MatchAttributes {
    id: number;
}

export interface MatchModel extends Model<Match>, Match {}

export type MatchStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): MatchModel;
};

export function matchFactory(sequelize: Sequelize): MatchStatic {
    return <MatchStatic>sequelize.define(
        'match',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            tournament_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            home_team_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            away_team_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            home_team_score: {
                type: DataTypes.INTEGER,
            },
            away_team_score: {
                type: DataTypes.INTEGER,
            },
            start_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            state: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            tableName: 'matches',
        }
    );
}
