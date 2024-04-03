// Brad Surinak
// Exercise Journal
// exercise_journal_server

const express = require('express')
const app = new express()
const path = require('path')
const ejs = require('ejs')
app.use(express.static('public'))
app.set('views', path.join(__dirname, './public/views'))
app.set('view engine', 'ejs')

app.listen(4000, () => {
    console.log("App for Exercise Journal is listening on port 4000")
})

app.get('/', (req, res)=> {
    res.render('index')
} )

app.get('/new_entry', (req, res)=> {
    res.render('new_entry')
} )

app.get('/journal', (req, res)=> {
    res.render('journal')
} )

app.get('/archive', (req, res)=> {
    res.render('archive')
} )