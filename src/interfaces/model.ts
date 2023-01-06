import { WhereOptions, Order, Includeable } from 'sequelize';

export interface QueryParams {
    page: number;
    limit: number;
    where?: WhereOptions;
    order?: Order;
    raw?: boolean;
    include?: Includeable | Includeable[];
}

export interface PaginationData<T> {
    items: T[];
    total: number;
}

export enum EMatchState {
    NotStartedYet = 1,
    HaftTime = 2,
    FullTime = 3,
}

export interface MatchesCountByDate {
    start_at_date: string;
    count: number;
}

export interface GetMatchesOptions {
    page: number; 
    limit: number; 
    tournamentId?: number;
    from?: string;
    to?: string;
}