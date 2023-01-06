import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import FastifyCORS from 'fastify-cors';
import { SERVER_URI, CLIENT_URI, NODE_ENV } from '../config';

export default function cors(fastify: FastifyInstance, opts: FastifyPluginOptions, done: (err?: Error) => void): void {
	fastify.register(FastifyCORS, {
		origin: (origin, cb) => {
			if (!origin
				|| (NODE_ENV == 'development' && /localhost|ngrok/.test(origin))
				|| CLIENT_URI == origin
				|| SERVER_URI == origin
			) {
				cb(null, true);
				return;
			}

			// Generate an error on other origins, disabling access
			cb(new Error("Not allowed"), false);
		},
	});

	done();
}
