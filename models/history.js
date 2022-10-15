const mongoose = require('mongoose');


const histroySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 250
    },
    password: {
        type: String,
        required: true, 
        minlength: 5,
        maxlength: 1024,
    },
    isAdmin: Boolean,
    isTechnician: Boolean
});


const History = mongoose.model('HIstory', histroySchema);




exports.History = History;
exports.validate = validateUser;

