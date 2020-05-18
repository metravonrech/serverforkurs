let asyncHandler = require('../errorHandlers/asyncHandler').catchAsync;
let AppError = require('../errorHandlers/AppError');
const mongoose = require('mongoose');

const Company = mongoose.model('Company');

module.exports = {
    saveCompany: asyncHandler(async (req, res, next) => {
        let newCompany = new Company({
            userID: req.body.userID,
            userName: req.body.userName,
            projectID: await Company.collection.countDocuments() + 1,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            location: req.body.location,
            images: req.body.images,
            youTubeLink: req.body.youTubeLink,
            donateGoal: req.body.donateGoal,
            duration: req.body.duration,
        });
        await newCompany.save(err => new AppError(`Error has appeared trying to save company, ${err.name}`, 500));
        return res.status(200).json('success');
    }),

    getCompanies: asyncHandler(async (req, res, next) => {
        let amount, page;
        !req.query.amount ? amount = 10 : amount = req.query.amount;
        !req.query.page ? page = 1 : page = req.query.page;
        return Company.find({})
            .skip(page * amount - amount)
            .limit(parseInt(amount))
            .then(companies => res.status(200).json(companies))
            .catch(err => new AppError(`Error has appeared trying to get companies, ${err.name}`, 500));
    }),

    getCompanyDetails: asyncHandler((req, res, next) => {
        Company.findOne({projectID: req.params.projectID}, (err, company) => {
            if (!err) return res.status(200).json(company);
            return new AppError(`Error has appeared trying to get company details, ${err.name}`, 500)
        });
    }),


    getCompaniesByCategory: asyncHandler(async (req, res, next) => {
        let amount, page;
        let filterArr = [];
        let projectCategory = JSON.parse(req.query.projectCategory);
        !req.query.amount ? amount = 10 : amount = req.query.amount;
        !req.query.page ? page = 1 : page = req.query.page;
        for (let category of projectCategory) {
            filterArr = [...filterArr, {category: category}]
        }
        return Company.find({$or: filterArr})
            .skip(page * amount - amount)
            .limit(parseInt(amount))
            .then(companies => {
                return res.status(200).json(companies)
            })
            .catch(err => new AppError(`Error has appeared trying to get companies by category, ${err.name}`, 500));
    }),


    getCompaniesBuUserId: asyncHandler(async (req, res, next) => {
        Company.find({userID: req.body.userID}, (err, companies) => {
            if (!err) return res.status(200).json(companies);
            return new AppError(`Error has appeared trying to get companies by user id, ${err.name}`, 500)
        });
    }),
    removeCompanyById: asyncHandler(async (req, result, next) => {
        Company.deleteOne({projectID: req.body.projectID}, (err, res) => {
            if (!err) return result.status(200).json('success');
            return new AppError(`Error has appeared trying to remove selected company, ${err.name}`, 500)
        });
    }),
    donate: asyncHandler(async (req, result, next) => {
        Company.findOneAndUpdate({projectID: req.body.projectID}, {currentSum: req.body.currentSum}, {useFindAndModify: false}, (err, res) => {
            if (!err) return result.status(200).json('success');
            return new AppError(`Error has appeared trying to record new donation, ${err.name}`, 500)
        });
    }),
    updateCompany: asyncHandler(async (req, res, next) => {
        Company.findOneAndUpdate({projectID: req.body.projectID},
            {
                name: req.body.name,
                category: req.body.category,
                description: req.body.description,
                location: req.body.location,
                yoTubeLink: req.body.yoTubeLink,
                donateGoal: req.body.donateGoal,
                duration: req.body.duration,
            }, {useFindAndModify: false}, (err, res) => {
                if (!err) return result.status(200).json('success');
                return new AppError(`Error has appeared trying to update selected company, ${err.name}`, 500)
            });
    })


};