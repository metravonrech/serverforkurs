let asyncHandler = require('../errorHandlers/asyncHandler').catchAsync;
let AppError = require('../errorHandlers/AppError');
const mongoose = require('mongoose');
const Company = mongoose.model('Company');

module.exports = {
    saveSingleRating: asyncHandler(async(req, result, next) => {
        Company.findOneAndUpdate({ projectID: req.body.companyID },
            { $push: { rating: { idUser: req.body.userID, personalRating: req.body.rating }} },
            {useFindAndModify: false},
            (err, res) => {
                if  (!err) return result.status(200).json('success');
                new AppError(`Error has appeared trying to record new rating, ${err.name}`, 500)
            })
    }),

};