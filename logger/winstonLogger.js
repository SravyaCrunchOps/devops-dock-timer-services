const winston = require('winston');

const { combine, timestamp, colorize, json, printf, errors } = winston.format;


const logger = winston.createLogger({
    format: combine(
        errors({stack: true}),
        json(),
        colorize({all: true}),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss A'}),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console()
    ],
});


module.exports = logger;