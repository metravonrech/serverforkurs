const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let commentSchema = Schema({
    idUser: String,
    userImg:String,
    userName: String,
    date:{
        type: String,
        default: new Date().toLocaleString(),
    },
    text: String, 
});
let ratingSchema = Schema({
    idUser: String,
    personalRating: Number,
});

let companySchema = Schema({
    userID: {
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    projectID:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        set: function(name) {
            if(!name) return this.name
            return name;
        }
    },
    description: {
        type: String,
        required: true,
        set: function(description) {
            if(!description) return this.description
            return description;
        }
    },
    category: {
        type: String,
        required: true,
        set: function(category) {
            if(!category) return this.category
            return category;
        }
    },
    location:{
        type: String,
        required: true,
        set: function(location) {
            if(!location) return this.location
            return location;
        }
    },
    images: {
        type: [String],
        // required: true
        set: function(images) {
            return [this.images, ...images]
        }
    },
    youTubeLink: {
        type: String,
        // required: true
        set: function(youTubeLink) {
            if(!youTubeLink) return this.youTubeLink
            return youTubeLink;
        }
    },
    donateGoal: {
        type: Number,
        required: true,
        set: function(donateGoal) {
            if(!donateGoal) return this.donateGoal
            return donateGoal;
        }
    },
    beginningDate: {
        type: Number,
        default: Date.now(),
    },
    duration: {
        type: Number,
        required: true,
        set: function(duration) {
            if(!duration) return this.duration
            return duration;
        }
    },
    currentSum: {
        type: Number,
        default: 0,
    },
    comments: [commentSchema],
    rating: [ratingSchema]
});


// companySchema.pre('save', function (next) {
//
// });

mongoose.model('Company', companySchema, 'companies');

// mongoose.model('User', userSchema, 'users');