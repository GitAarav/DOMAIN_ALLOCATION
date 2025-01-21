const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    questionNumber: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true 
    },
    answer: {
        type: String,
        required: false
    }
});

const domainSchema = mongoose.Schema({
    domainName: {
        type: String,
        enum: ['management', 'design', 'web', 'ml', 'app', 'ece', 'iot', 'cp', 'mg'],
        required: true
    },
    questions: [questionSchema]
}, { timestamps: true });

const Domain = mongoose.model('Domain', domainSchema);

module.exports = Domain;
