const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI,
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
 },err => {
    if(err){
        console.log(err);
    } else {
        console.log('Succefully connected to database');
    }
});

require('./user.model');
require('./company.model');