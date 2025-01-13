const mongoose = require('mongoose');
const validator = require('validator');


const emailSchema = mongoose.Schema({
    email:{
        type:String,
        required: [true, 'Please enter an email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    role : {
        type:String,
        required: true,
        enum: ['admin', 'user']
    }
},{timestamps : true})

const validateEmail = mongoose.model('valisdateEmail',emailSchema);

module.exports = validateEmail;

