const mongoose = require('mongoose');
const Company = mongoose.model('Company');

module.exports = {
    saveSingleRating: async(req, result, next) => {
        Company.findOneAndUpdate({ projectID: req.body.companyID },
            { $push: { rating: { idUser: req.body.userID, personalRating: req.body.rating }} },
            {useFindAndModify: false},
            (err, res) => {
                if  (!err) return result.status(200).json('success');
            })
    },

};