var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var QuickBooks = require('node-quickbooks');

var qbconnect = require('./routes/qbconnect');
var qbSDK = require('./routes/qbSDK');
var userInfo = require('./routes/userInfo');

var app = express();

const database = require('./DAL/database');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('appCenter', QuickBooks.APP_CENTER_BASE);
QuickBooks.setOauthVersion('2.0');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.svg')));

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ resave: false, saveUninitialized: false, secret: 'JMAccountingAPI' }));

app.get('/', (req, res) => res.render('pages/qbconnect'));
app.get('/home', (req, res) => res.render('pages/home'));
app.get('/error', (req, res) => res.render('pages/qbconnect-error'));

app.use('/api', qbconnect);
app.use('/api/qbSDK', qbSDK);
app.use('/api/userInfo', userInfo);

function initCustomMiddleware() {
    if (process.platform === "win32") {
        require("readline").createInterface({
            input: process.stdin,
            output: process.stdout
        }).on("SIGINT", () => {
            console.log('SIGINT: Closing MongoDB connection');
            database.close();
        });
    }

    process.on('SIGINT', () => {
        console.log('SIGINT: Closing MongoDB connection');
        database.close();
    });
}


function initDb() {
    database.open(() => { });
}

initCustomMiddleware();
initDb();

module.exports = app;
