const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');


router.post('/login', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');
    
    const token = user.generateAuthToken();
    res.status(200).header('x-auth-token', token).send(_.pick(user, ['name', 'email']));
    
});


const validate = (request) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(250).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });

    return schema.validate(request);
};



module.exports = router;