// importing mongoose module
const mongoose = require('mongoose');

// connecting to the database
mongoose
    .connect('mongodb://localhost:27017')
    .then(() => {
        console.log('connection successful');
    })
    .catch((e) => {
        console.log('connection failed');
    });
