const createError = require('http-errors');
const express = require('express');
const path = require('path');
const config = require('config');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

require('./startup/errorLogging')();
require('./startup/routes')(app);
require('./startup/db')();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
