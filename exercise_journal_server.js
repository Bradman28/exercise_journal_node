// Brad Surinak
// Exercise Journal
// exercise_journal_server

const express = require('express');
const bodyParser = require('body-parser');
const app = new express();
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const dayjs = require('dayjs');

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

// app.get('/archive', (req, res)=> {
//     res.render('archive')
// });

const new_entry = require('./models/new_journal_entries.js')
// handle form submission for user input
app.post('/posts/store', async (req, res) => {
    try {

        req.body.date = dayjs(req.body.date).format('ddd MM DD YYYY');

        await new_entry.create(req.body)
        // res.redirect('/journal');
    }
    catch(error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

const items_per_page = 10;
app.get('/journal', async (req, res)=> {
    try {

        const page = parseInt(req.query.page) || 1;

        const skip = (page - 1) * items_per_page;
        const total_entries = await new_entry.countDocuments();

        const all_entries = await new_entry.find({})
            .sort({date: -1})
            .skip(skip)
            .limit(items_per_page)
            .exec();

        const has_next_page = (page * items_per_page) < total_entries;

        res.render('journal', {
            all_entries: all_entries,
            page: page,
            has_next_page: has_next_page
        });

    } catch (error) {
        console.error('Error retrieving entries:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/journal/filter', async (req, res) => {
    try {
        const start_date = req.query.start_date;
        const end_date = req.query.end_date;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * items_per_page;

        const filtered_entries = await new_entry.find(
            {date: {$gte: start_date, $lte: end_date}})
            .sort({date: -1})
            .skip(skip)
            .limit(items_per_page)
            .exec();

        const total_filtered_entries = await new_entry.countDocuments({
            date: { $gte: start_date, $lte: end_date }
        });

        const has_next_page = (page * items_per_page) < total_filtered_entries;

        res.render('journal', {
            all_entries: filtered_entries,
            page: page,
            has_next_page: has_next_page
        });
    } catch (error) {
        console.error('Error retrieving filtered entries:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/posts/remove', async (req, res) => {
    try {
        const entry_id = req.body.id;
        console.log('Entry ID:', entry_id);

        // Check if entry ID is empty
        if (!entry_id) {
            return res.status(400).send('Entry ID is missing');
        }

        const removed_entry = await new_entry.deleteOne({_id: entry_id});
        if (!removed_entry) {
            return res.status(404).send('Entry not found');
        }
        console.log('removed entry: ', removed_entry)
        res.redirect('/journal');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

