// Brad Surinak
// Exercise Journal
// exercise_journal_server

const express = require('express');
const bodyParser = require('body-parser');
const app = new express();
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');

// connect to mongodb and error handler
mongoose.connect('mongodb://localhost/exercise_entries');
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error', err)
});

// test tb connection
// const db = mongoose.connection;
// db.on('error', console.error.bind(console,'Mongodb connection error:'));
// db.once('open', () => {
//     console.log('connected to mongodb');
// })

// static files
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// register view engine and set up middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './public/views'));

// listen for requests
app.listen(4000, () => {
    console.log("App for Exercise Journal is listening on port 4000")
});

app.get('/', (req, res)=> {
    res.render('index')
});

app.get('/new_entry', (req, res)=> {
    res.render('new_entry')
});

// app.get('/journal', (req, res)=> {
//     res.render('journal')
// });

app.get('/archive', (req, res)=> {
    res.render('archive')
});

const new_entry = require('./models/new_journal_entries.js')
// handle form submission for user input
app.post('/posts/store', async (req, res) => {
    try {
        // const date = new Date(req.body.date);
        // req.body.date = date.toDateString();

        await new_entry.create(req.body)
        res.redirect('/journal');
    }
    catch(error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.get('/journal', async (req, res)=> {
    try {
        const all_entries = await new_entry.find({}).exec();
        // const heatmap = generate_heatmap(all_entries);
        console.log('All entries', all_entries);
        res.render('journal', {all_entries: all_entries});

    } catch (error) {
        console.error('Error retrieving entries:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/journal/filter', async (req, res) => {
    try {
        const start_date = req.query.start_date;
        const end_date = req.query.end_date;
        const filtered_entries = await new_entry.find({date: {$gte: start_date, $lte: end_date}});
        res.render('journal', {all_entries: filtered_entries});
    } catch (error) {
        console.error('Error retrieving filtered entries:', error);
        res.status(500).send('Internal Server Error');
    }
})