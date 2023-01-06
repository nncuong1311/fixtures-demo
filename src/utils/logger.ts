import pino, { Logger } from 'pino';
const saveLog = process.env.SAVE_LOG;

const formatters = {
    bindings: bindings => ({}),
};

const appLogger: any = saveLog ? pino({ formatters }, pino.destination('./app.log')) : pino({ formatters });
const crawlerLogger: any = saveLog ? pino({ formatters }, pino.destination('./crawler.log')) : pino({ formatters });

class BaseLogger {
    constructor(pinoLogger: Logger) {
        this.logger = pinoLogger;
    }

    log(...args: any[]): void {
        console.log(args);
        this.logger.info(this.buildMessagePattern(...args), ...args);
    }

    warn(...args: any[]): void {
        console.warn(args);
        this.logger.warn(this.buildMessagePattern(...args), ...args);
    }

    error(...args: any[]): void {
        console.error(args);
        this.logger.error(this.buildMessagePattern(...args), ...args);
    }

    private buildMessagePattern(...args: any[]): string {
        let pattern = '';
        for (let arg of args) {
            if (typeof arg == 'object') pattern += '%o ';
            else pattern += '%s ';
        }

        return pattern;
    }

    private logger: Logger;
}

const AppLogger = new BaseLogger(appLogger);
const CrawlerLogger = new BaseLogger(crawlerLogger);

export { AppLogger, CrawlerLogger };
