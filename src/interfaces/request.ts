import { FastifyRequest, RequestGenericInterface } from 'fastify';

export interface RequestWithUser<B = any, P = any, Q = any> extends FastifyRequest {
    body: B;
    params: P;
    query: Q;
    user?: any;
}

export interface RequestGeneric<T> extends RequestGenericInterface {
    Body?: T;
}
