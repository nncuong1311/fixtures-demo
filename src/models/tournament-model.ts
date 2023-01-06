import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface TournamentAttributes {
    id?: number;
    name: string;
    logo: string;
}

export interface Tournament extends TournamentAttributes {
    id: number;
}

export interface TournamentModel extends Model<Tournament>, Tournament {}

export type TournamentStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): TournamentModel;
};

export function tournamentFactory(sequelize: Sequelize): TournamentStatic {
    return <TournamentStatic>sequelize.define(
        'tournament',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            logo: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            tableName: 'tournaments',
        }
    );
}
