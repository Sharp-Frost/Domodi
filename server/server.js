// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');



// set our port
var port = process.env.PORT || 8080;


// configure app to use bodyParser() this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Allow cross domain requests :
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');  // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Credentials', true); // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
    next(); // Pass to next layer of middleware
});


// DATABASE SETUP
// =============================================================================
// connect to our database
mongoose.connect('mongodb://localhost:27017/Domodi');


// ROUTES FOR OUR API
// =============================================================================
var api = require('./app/routes/routes');
var devicesRouter = require('./app/routes/devicesRouter');
var profilesRouter = require('./app/routes/profilesRouter');
var notificationsRouter = require('./app/routes/notificationsRouter');
var alertsRouter = require('./app/routes/AlertsRouter');
app.use('/domodi', api);
app.use('/domodi', devicesRouter);
app.use('/domodi', profilesRouter);
app.use('/domodi', notificationsRouter);
app.use('/domodi', alertsRouter);


// SOCKET IO
// =============================================================================
var http = require('http').Server(app);



// START THE SERVER
// =============================================================================
console.log('Node server started on port ' + port);
http.listen(port);
module.exports = app;


// START THE ADDITIONAL SERVICES
// ===============

var WebSocketService = require("./app/services/webSocketService.js");
var webSocketService = WebSocketService(http);
webSocketService.start();

var CronService = require("./app/services/cronService.js");
var cronService = CronService();
cronService.start();

var NotificationsServices = require("./app/services/notificationsServices.js");
var notificationsServices = NotificationsServices();
notificationsServices.start();