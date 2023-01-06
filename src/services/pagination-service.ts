import { FindAndCountOptions } from 'sequelize';
import { QueryParams, PaginationData } from '../interfaces/model';
import { StaticModel } from '../models';

export async function paginate<T>(model: StaticModel, query: QueryParams): Promise<PaginationData<T>> {
    const { page, limit, where, order, raw, include } = query;
    let options: FindAndCountOptions = {
        limit,
        offset: page * limit,
    };
    if (where) {
        options.where = where;
    }
    if (order) {
        options.order = order;
    }
    if (raw) {
        options.raw = raw;
    }

    if (include)
        options.include = include;

    const { rows, count } = await model.findAndCountAll(options);

    return {
        items: rows as T[],
        total: count,
    };
}
