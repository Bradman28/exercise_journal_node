// Brad Surinak
// Exercise Journal
// exercise_journal_server

// imports for building app, handling routes, parsing request bodies, rendering views, mongoDB, and dates
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


// express to serve static files and middleware parsers for JSON/ incoming URL requests
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// register view engine for express to ejs, and where ejs files are located
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

// module to interact with database, defining mongoose model for new journal entries
const new_entry = require('./models/new_journal_entries.js')

// handle form submission for user input
app.post('/posts/store', async (req, res) => {
    try {

        req.body.date = dayjs(req.body.date).format('ddd MM DD YYYY');

        // creates new entry in the database
        await new_entry.create(req.body);

        res.redirect('/journal');
    }
    catch(error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// define items per page as 10
const items_per_page = 10;
app.get('/journal', async (req, res)=> {
    try {
        // extract page query, defaults to 1, skip used to paginate results
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * items_per_page;

        // retrieves total number of entries in database
        const total_entries = await new_entry.countDocuments();

        //mongoDB query to fetch entries from database, sort by descending order, skips based on current page
        const all_entries = await new_entry.find({})
            .sort({date: -1})
            .skip(skip)
            .limit(items_per_page)
            .exec();

        // calculate whether there are more pages of entries beyond current page
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

        // stores total number of entries that match specified range
        const filtered_entries = await new_entry.find(
            {date: {$gte: start_date, $lte: end_date}})
            .sort({date: -1})
            .skip(skip)
            .limit(items_per_page)
            .exec();

        // stores total number of journal entries for pagination
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

