import { PORT, APP_HOST } from './config';
import { initDatabase } from './models';
import server from './app';
import { AppLogger as logger } from './utils/logger';

async function start(): Promise<void> {
    try {
        await initDatabase();

        await server.listen(PORT, APP_HOST);
        logger.log(`App's listening on the port ${PORT}`);
    } catch (err) {
        logger.error('Error on start', err);
        process.exit(1);
    }
}

start();
