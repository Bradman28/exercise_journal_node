// Brad Surinak
// Model for new journal entry
// new_journal_entries.js


const mongoose = require('mongoose')
const new_journal_entry = require('../models/new_journal_entries')
const {status} = require("express/lib/response");

// connect to mongodb and error handler
mongoose.connect('mongodb://localhost/exercise_entries');
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error', err)
});

new_journal_entry.find({
    date: "2024-04-07",
    exercise: "chest",
    weight: "",
    sets: "",
    reps: ""
})
.then(entry => {
    console.log('Entry added successfully', entry);
    status(201).send('Entry added successfully');
})
.catch(error => {
    console.error('Error adding entry:', error);
    status(500).send('Error adding entry');
});