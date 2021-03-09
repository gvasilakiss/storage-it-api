const express = require("express");
var cors = require('cors');
// HTTP request logger middleware
var morgan = require('morgan');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const route = require('./Routes/index.js');

const app = express();

// Use cors
app.use(cors());
app.use(morgan('tiny'));
// initiate bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', route);

app.listen(process.env.PORT || 3000, () => {
	console.log('StorageIT running on port ' + (process.env.PORT || 3000))
});