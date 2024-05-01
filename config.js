require('dotenv').config();

const config = {
    server: {
        port: process.env.PORT
    },
    database: {
        mongoUrl: process.env.MONGODB_URL
    },
    start: {
    // "start": "node --require ./instrumentation.js index.js"
    }
}

module.exports = config;