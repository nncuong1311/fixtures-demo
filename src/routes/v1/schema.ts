import Joi from 'joi';

export function getBasedSchema(tag: string, includeSecurity: boolean): any {
    const schema: any = {
        tags: [tag],
    };

    if (includeSecurity) {
        schema.security = [
            {
                authorization: [],
            },
        ];
    }

    return schema;
}

export function getPaginateQuerySchema(query?: any): any {
    return {
        querystring: Joi.object({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(10),
            ...query,
        }).required(),
    };
}

export function metricToRouteParam(metric: string): string {
    return metric.replace(/\//g, '--');
}

export function routeParamToMetric(metric: string): string {
    return metric.replace(/--/g, '/');
}
