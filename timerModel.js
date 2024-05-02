const mongoose = require('mongoose');

const timerSchema = mongoose.mongoose.Schema({
    userData: { 
        displayName: String,
        email: String
    },
    userTasks: []
});

const Timer = mongoose.model('Task_Trackers', timerSchema);

module.exports = Timer;