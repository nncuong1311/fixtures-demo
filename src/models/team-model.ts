import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface TeamAttributes {
    id?: number;
    name: string;
    logo: string;
}

export interface Team extends TeamAttributes {
    id: number;
}

export interface TeamModel extends Model<Team>, Team {}

export type TeamStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): TeamModel;
};

export function teamFactory(sequelize: Sequelize): TeamStatic {
    return <TeamStatic>sequelize.define(
        'team',
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
            tableName: 'teams',
        }
    );
}
