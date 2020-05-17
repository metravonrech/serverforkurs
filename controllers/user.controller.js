const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

async function foundUser(email) {
    let exists = await User.findOne({'local.email': email});
    return !!exists;
}


module.exports = {
    register: async (req, res, next) => {
        if (await foundUser(req.body.email)) {
            return res.status(422).send(['This email already exists']);
        }
        let user = new User({
            method: 'local',
            'local.userID': await User.collection.countDocuments() + 1,
            'local.userName': req.body.username,
            'local.email': req.body.email,
            'local.password': req.body.password,
            'local.isAdmin': false,
        });
        await user.save((err, doc) => {
                if (!err) return res.send(doc);
                else {
                    console.log(err);
                    return next(err)
                }
                ;
            }
        );
    },

    userProfile: async (req, res, next) => {
        await User.findOne({_id: req._id}, (err, user) => {
                if (!user)
                    return res.status(404).json({status: false, message: 'User record not found.'});
                else {
                    let method = user.method;
                    let objUser = {
                        userID: user[method].userID,
                        _idBD: user._id,
                        userName: user[method].userName,
                        userEmail: user[method].email,
                        userIsAdmin: user[method].isAdmin,
                    };
                    return res.status(200).json({
                        status: true,
                        user: _.pick(objUser, ['userID', '_idBD', 'userName', 'userEmail', 'userIsAdmin'])
                    });
                }
            }
        );
    },

    authenticate: async (req, res, next) => {
        await passport.authenticate('local', (err, user, info) => {
            if (err) return res.status(400).json(err);
            else if (user) return res.status(200).json({
                "token": user.generateJwt('local'),
                'userID': user.local.userID,
                'email': user.local.email,
                'userName': user.local.userName,
                '_idBD': user._id
            });

            else return res.status(404).json(info);
        })(req, res)

    },

    facebookOauth: async (req, res, next) => {
        let facebookUser = req.user.facebook;
        User.findOne({"facebook.email": facebookUser.email}, (err, user) => {
            if (!err) return res.status(200).json({
                "token": user.generateJwt('facebook'),
                'userID': user.facebook.userID,
                'email': user.facebook.email,
                'userName': user.facebook.userName,
                '_idBD': user._id
            });
        });
    },

    googleOauth: async (req, res, next) => {
        let googleUser = req.user.google;
        User.findOne({'google.email': googleUser.email}, (err, user) => {
            if (!err) return res.status(200).json({
                "token": user.generateJwt('google'),
                'userID': user.google.userID,
                'email': user.google.email,
                'userName': user.google.userName,
                '_idBD': user._id
            });
        });
    }
};
 

