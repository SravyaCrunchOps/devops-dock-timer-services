const express = require('express');
const cors = require('cors');
const config = require('./config');
const mongoose = require('mongoose');
const TaskTracker = require('./timerModel'); 
const PORT = config.server.port;
// const { logger, errLogger } = require('./logger/expressWinston');
const logger = require('./logger/winstonLogger');
// const morgan = require('morgan')

const app = express();

// mongoose connect
const mongoUrl = config.database.mongoUrl;
const db = mongoose.connect(mongoUrl);

// cors middleware
app.use(express.json());
app.use(cors());


// morgan middleware
// app.use(morgan('combined', {stream: logger.stream}));
app.use((req, res, next) => {
    logger.info(req.originalUrl)
    next()
})

// middlewares
app.post('/user-tasks', async (req, res) => {
    const existinguser = await TaskTracker.findOne({'userData.email': req.body.userData.email})
    var payload = {
        userData: req.body.userData,
        userTasks: [{
            date: req.body.date,
            isFinished: req.body.isFinished,
            tasks: [...req.body.userTasks]
        }]
    }
    const filter = {'userData.email': {$in: [req.body.userData.email]}}
    const opts = {new: true, upsert: true}

    // new user
    if(!existinguser) {
        // const doc = await TaskTracker.findOneAndUpdate(filter, payload, opts) 
        const doc = await TaskTracker.create(payload)
        logger.info('New users - new task -> is saved in database')
        doc.save();
    }
    // old user
    else {
        // Is it new-date or old-date ?
        const oldT = existinguser.userTasks.findIndex(t => t.date === req.body.date)
        if(oldT === -1) { // new date
            const oldTask = existinguser.userTasks.map(t => t) // returns prev tasks
            const newTask = {
                date: req.body.date,
                isFinished: req.body.isFinished,
                tasks: req.body.userTasks
            }
            payload = {
                userTasks: [...oldTask, newTask]
            }
            // retain old-date and add new-date task
            const doc = await TaskTracker.findOneAndUpdate(filter, payload, opts) 
            logger.info('Existing users - new task -> is saved in database')
            doc.save();
        } else { 
            // if same date
            const targetDate = req.body.date.split(' ')[0]
            // old-date [ date exists already ? ] => just update the old-date tasks
            const doc = await TaskTracker.findOneAndUpdate(
                {'userTasks.date': targetDate}, 
                {$set: {'userTasks.$.tasks': req.body.userTasks}},
                {new: true}
            )
            doc.save();
            logger.info('Existing user - same date tasks -> is saved in database')
        }
    }
    return res.send('submitted')
})

app.post('/tasks', async (req, res) => {
    const existinguser = await TaskTracker.findOne({'userData.email': req.body.email})
    if(!existinguser) {
        logger.warn('Tasklist is not sent to client! Maybe email is wrong or please create new task')
    }
    if(existinguser) {
        return res.send(existinguser)
    }
    return;
})


if(db) {
    app.listen(PORT, (err, client) => {
        if(err) console.log(err.message)
        console.info('server connected at PORT: ', PORT)
        console.log('MongoDB database is connected.')
    });
}