/* eslint-disable prettier/prettier */
// server.js
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    mongoose = require('mongoose'),
    cors = require('cors');

const Environment = require("./server/config/env.js");

mongoose.connect(Environment.dbUrl).then(
    () => {console.log('Database connection is successful') },
    err => { console.log('Error when connecting to the database'+ err)}
);

require('./server/models/Agenda');
 

var router = express.Router();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(require('./server/routes'));
app.use(serveStatic(__dirname + "/dist"));


var port = process.env.PORT || 5000;
app.listen(port);

console.log('server started '+ port);
