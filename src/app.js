const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({origin: 'http://localhost:3002',credentials: true}));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()) // for parsing cookie from requests

const rescueRouter = require('./routes/rescueRouter');
const riderRouter = require('./routes/riderRouter.js');
const relativeRouter = require('./routes/relativeRouter.js');
const reportRouter = require('./routes/reportRouter.js');

app.use('/api/rescue-services', rescueRouter);
app.use('/api/rider', riderRouter);
app.use('/api/rider/relative', relativeRouter);
app.use('/api/report', reportRouter);

module.exports = app;
