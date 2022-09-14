const mongoose = require('mongoose');
const Joi = require('joi');
const _ = require('lodash');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
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

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(_.pick(this, ['id', 'name', 'email', 'isAdmin']), process.env.JWT_SECRET);
    return token;
}

const User = mongoose.model('User', userSchema);

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(250).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });

    return schema.validate(user);
};


exports.User = User;
exports.validate = validateUser;