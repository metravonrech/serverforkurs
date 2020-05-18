let AppError = require('../errorHandlers/AppError');

const express = require('express');
const router = express.Router();
const jwtHelper = require('../configuration/jwtHelper');
const passport = require('passport');

const userController = require('../controllers/user.controller');
const companyController = require('../controllers/company.controller.js');
const ratingController = require('../controllers/rating.controller');
const commentController = require('../controllers/comment.controller');

router.post('/auth/register', userController.register);
router.post('/auth/authenticate', userController.authenticate);
router.get('/auth/me', jwtHelper.verifyJwtToken, userController.userProfile);
router.post('/oauth/facebook', passport.authenticate('facebook-token', { session: false }), userController.facebookOauth);
router.post('/oauth/google', passport.authenticate('google-token', {session: false}), userController.googleOauth);

router.post('/saveCompany', companyController.saveCompany);
router.get('/getCompanies', companyController.getCompanies);
router.post('/getCompaniesBuUserId', companyController.getCompaniesBuUserId);
router.post('/removeProjectById', companyController.removeCompanyById);
router.get('/getCompanyDetails/:projectID?', companyController.getCompanyDetails);
router.get('/getCompaniesByCategory', companyController.getCompaniesByCategory);
router.put('/donate', companyController.donate);
router.put('/updateCompany', companyController.updateCompany);


router.put('/saveComment', commentController.saveComment);

router.put('/saveRating', ratingController.saveSingleRating);

router.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


module.exports = router;