// Brad Surinak
// Model for new journal entry
// new_journal_entries.js

// import mongoose library and create schema class
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// defines schema for journal entry
const exercise_entry_schema = new Schema({
    date: {type: Date, required: true},
    body_part: {type: String, required: true},
    exercise: {type: String, required: true},
    weight: {type: String},
    sets: {type: String},
    reps: {type: String}
});

//create model based on schema
const journal_entry = mongoose.model('journal_entry', exercise_entry_schema);

//export so module can be used in other files
module.exports = journal_entry;
