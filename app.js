
require('./configuration/config');
require('./models/db-connection');
require('./configuration/passportConfig');
require('./errorHandlers/errorHandler');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
// let socketIO = require('socket.io');

const app = express();
const router = require('./routes/router');
let http = require('http');
let server = http.Server(app);



app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', router);



app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});


server.listen(process.env.PORT, () => {
    console.log(`Server has started on port: ${process.env.PORT}`);
});


