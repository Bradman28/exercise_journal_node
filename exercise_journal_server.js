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

const new_entry = require('./models/new_journal_entries.js')
// handle form submission for user input
app.post('/posts/store', (req, res) => {
    new_entry.create(req.body)
        .then(entry => {
            res.redirect('/journal');
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal server error');
        })
    console.log(req.body);
});

app.get('/journal', (req, res)=> {
    res.render('journal')
});

app.get('/archive', (req, res)=> {
    res.render('archive')
});

// app.use((req, res) => {
//     res.status(404).render('404')
// });