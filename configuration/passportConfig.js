const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const facebookTokenStrategy = require('passport-facebook-token');
const googleTokenStrategy = require('passport-google-token').Strategy;
let User = mongoose.model('User');

passport.use('facebook-token', new facebookTokenStrategy({
    clientID: '417240015664074',
    clientSecret: 'd46f0675d8733978faca0f7565f11e8a'
}, async (accessToken, refreshToken, profile, done,) => {
    try {
        let foundUser = await User.findOne({'facebook.id': profile.id});
        if (foundUser) return done(null, foundUser);
        let newUser = await new User({
            method: 'facebook',
            facebook: {
                id: profile.id,
                userID: await User.collection.countDocuments() + 1,
                userName: profile.displayName,
                email: profile.emails[0].value,
                isAdmin: false
            }
        });
        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error, false, error.message);
    }
}));

passport.use('google-token', new googleTokenStrategy({
    clientID: '16073129096-de3gpdq3igf2hghcmbbans5votkof1lv.apps.googleusercontent.com',
    clientSecret: 'sXzTOCW5gcpYW8kz0BWD_84j'
}, async (accessToken, refreshToken, profile, done,) => {
    try {
        let foundUser = await User.findOne({'google.id': profile.id});
        if (foundUser) return done(null, foundUser);
        let newUser = await new User({
            method: 'google',
            google: {
                id: profile.id,
                userID: await User.collection.countDocuments() + 1,
                userName: profile.displayName,
                email: profile.emails[0].value,
                isAdmin: false
            }
        });
        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        console.log(error)
        return done(error, false, error.message);
    }
}));

passport.use(new localStrategy({usernameField: 'email'}, (username, password, done) => {
        User.findOne({'local.email': username},
            (err, user) => {
                if (err) return done(err);
                // unknown user
                else if (!user) return done(null, false, {message: 'Email is not registered'});
                // wrong password
                else if (!user.verifyPassword(password)) return done(null, false, {message: 'Wrong password.'});
                // authentication succeeded
                else return done(null, user);
            });
    })
);