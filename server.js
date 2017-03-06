'use strict';

var express = require('express'),
    helmet = require('helmet'),
    fs = require('fs'),
    path = require('path'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    https = require('https');

var index = require('./routes/index'),
    bot = require('./routes/bot'),
    whk = require('./routes/webhook');

var app = express(),
    route = express.Router(),
    server;

var whitelist = [ 'http://localhost:3000' ],
    corsOptions = {
        origin: function(origin, callback){
            var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
            callback(null, originIsWhitelisted);
        },
        credentials: true
    },
    ports = [80, 443];



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors(corsOptions));

// public resource
app.use(express.static('public'));

// template engine
// v1 for first version of screenshot server
app.use('/v1/', route);

var server = https.createServer(
  {
    key: fs.readFileSync('./tls/key.pem'),
    cert: fs.readFileSync('./tls/cert.pem')
  },
  app
)

// route
route.get('/', index.getMsg);
route.get('/bot', bot.init);
route.get('/query', bot.query);
route.get('/find', bot.find);
route.get('/stats', bot.stats);

// webhook
route.get('/callback', whk.hookOnLine);
route.post('/callback', whk.hookOnLine);


app.listen(ports[0], function () {
    console.log('http listening on port', ports[0]);
});

server.listen(ports[1], function () {
    console.log('https listening on port', ports[1]);
});
