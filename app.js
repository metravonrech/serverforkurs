
require('./configuration/config');
require('./models/db-connection');
require('./configuration/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
// let socketIO = require('socket.io');

const app = express();
const router = require('./routes/router');
let http = require('http');
let server = http.Server(app);


//middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', router);

//error handler

app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors);
    }
});

// io.on('connection', (socket) => {
//     console.log('user connected');
//
//     socket.on('new-message', (message) => {
//         console.log('mess ', message);
//         commentController.saveComment(message);
//         io.emit('new-message', message);
//     });;
// });

//start server
server.listen(process.env.PORT, () => {
    console.log(`Server has started on port: ${process.env.PORT}`);
});


