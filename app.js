const createError = require('http-errors');
const express = require('express');
const path = require('path');
const hbs = require('hbs');
require('./app_api/models/db');
const apiRouter = require('./app_api/routes/index');
const indexRouter = require('./app_server/routes/index');
const travelRouter = require('./app_server/routes/travel');
const roomsRouter = require('./app_server/routes/rooms');
const mealsRouter = require('./app_server/routes/meals');
const newsRouter = require('./app_server/routes/news');
const aboutRouter = require('./app_server/routes/about');
const contactRouter = require('./app_server/routes/contact');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Register partials
hbs.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));

// Routes
app.use('/', indexRouter);
app.use('/travel', travelRouter);
app.use('/rooms', roomsRouter);
app.use('/meals', mealsRouter);
app.use('/news', newsRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/api', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
}, apiRouter);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;