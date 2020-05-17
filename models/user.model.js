const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

let userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'facebook', 'google'],
        required: true
    },
    local: {
        userID: {
            type: Number,
        },
        userName: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true,
            // unique: true
        },
        password: {
            type: String,
            minlength: [4, 'Password must be atleast 4 character long']
        },
        isAdmin: {
            type: Boolean,

        },
        saltSecret: String
    },
    facebook: {
        userID: {
            type: Number,
        },
        id: {
            type: String,
        },
        userName: {
            type: String,

        },
        email: {
            type: String,
            lowercase: true,
        },        
        isAdmin: {
            type: Boolean,

        },
    },
    google: {
        userID: {
            type: Number,
        },
        id: {
            type: String,
        },
        userName: {
            type: String,

        },
        email: {
            type: String,
            lowercase: true,
        },        
        isAdmin: {
            type: Boolean,

        },
    },
});

// Custom validation for email
userSchema.path('local.email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

userSchema.pre('save', function (next) {
    if(this.method !== 'local') next ();
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.local.password, salt, (err, hash) => {
            this.local.password = hash;
            this.local.saltSecret = salt;
            next();
        });
    });
});

userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.generateJwt = function (method) {
    return jwt.sign({ _id: this._id, isAdmin: this[method].isAdmin, userName: this[method].userName},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
};

mongoose.model('User', userSchema, 'users');

