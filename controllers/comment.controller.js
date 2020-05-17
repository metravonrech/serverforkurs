const mongoose = require('mongoose');

const Company = mongoose.model('Company');

module.exports = {
    saveComment: async (commentData, result, next) => {
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
            })
    },


};