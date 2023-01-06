import { FastifyError } from 'fastify';

export default class ApiError extends Error implements FastifyError {
    public statusCode: number;

    public code: string;

    constructor(status: number, message: string) {
        super(message);
        this.statusCode = status;
        this.code = status.toString();
    }
}
