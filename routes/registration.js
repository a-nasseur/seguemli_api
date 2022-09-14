const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');


router.post('/register', async (req, res) => {
    const { error } = validate(req.body);
    
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registered');

    let entry = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    entry.password = await bcrypt.hash(entry.password, salt);

    entry = await entry.save();
    const token = entry.generateAuthToken();
    res.status(201).header('x-auth-token', token).send(_.pick(entry, ['id', 'name', 'email']));

});     


module.exports = router;