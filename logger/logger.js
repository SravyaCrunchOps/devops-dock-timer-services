const winston = require('winston');
const { combine, timestamp, json, prettyPrint } = winston.format;



const logger = winston.createLogger({
    level: 'info',
    format: combine(
        json(),
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new winston.transports.File({
            filename: './logger/pomodoro_info.log', level: 'info'
        })
    ]
});

module.exports = logger;