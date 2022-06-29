import winston from 'winston';
export type loggerLevel = "dev_error" | "dev_warn" | "dev_info" | "sec_error" | "sec_warn" | "sec_info" | "error" | "warn" | "info" | "http" | "verbose" | "debug"
type logLevel = { [name in loggerLevel]: number }
type logLevelColor = { [name in loggerLevel]: string }
const level: { levels: logLevel, colors: logLevelColor } = {
    //dev: development
    //sec: security
    levels: {
        dev_error: 0,                       //error in development, like query string, wrong format JSON.
        dev_warn: 1,                        //action that should not happen, like duplicate username.
        dev_info: 2,                        //noice something
        sec_error: 3,                       //security risk
        sec_warn: 4,                        //warning, like wrong password
        sec_info: 5,                        //security action, like change user permissions
        error: 6,                           //error in production, like sell data mismatch sum
        warn: 7,                            //wrong action, like upload too big file
        info: 8,                            //who is access content
        http: 9,                            //who is access page
        verbose: 10,
        debug: 11,
    },
    colors: {
        dev_error: 'bold red cyanBG',
        dev_warn: 'bold yellow cyanBG',
        dev_info: 'bold grey cyanBG',
        sec_error: 'bold white redBG',
        sec_warn: 'bold yellow redBG',
        sec_info: 'bold blue redBG',
        error: 'red',
        warn: 'yellow',
        info: 'blue',
        http: 'gray',
        verbose: 'cyan',
        debug: 'green',
    }
};
winston.addColors(level.colors);

export type createLoggerProps = {
    minimumLevel?: loggerLevel,
    logFrom?: string,
    transports?: winston.transport | winston.transport[]
    productionMode?: boolean

}
export function createLogger(props: createLoggerProps) {
    const logger = winston.createLogger({
        level: props.minimumLevel ?? 'http',
        levels: level.levels,
        format: winston.format.simple(),
        defaultMeta: { from: props.logFrom ?? 'server', logger: '' },
        transports: props.transports,
    }) as winston.Logger & Record<loggerLevel, winston.LeveledLogMethod>;

    if (!props.productionMode) {
        logger.add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(info => `${info.timestamp} [${info.from}] ${info.level}: ${info.message}`)
            ),
            level: 'debug'
        }));
    }

    return logger

}

