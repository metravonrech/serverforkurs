let asyncHandler = require('../errorHandlers/asyncHandler').catchAsync;
let AppError = require('../errorHandlers/AppError');

const mongoose = require('mongoose');
const Company = mongoose.model('Company');

module.exports = {
    saveComment: asyncHandler(async (commentData, result, next) => {
        Company.findOneAndUpdate({projectID: commentData.body.projectID},
            {
                $push: {
                    comments: {
                        idUser: commentData.body.userID,
                        userImg: commentData.body.img,
                        userName: commentData.body.userName,
                        text: commentData.body.commentText
                    }
                }
            },
            {useFindAndModify: false},
            (err, res) => {
                if (!err) return result.status(200).json('success');
                else if(err) return new AppError(`Error has appeared trying to add new comment, ${err.name}`, 500)
            })
    }),
};