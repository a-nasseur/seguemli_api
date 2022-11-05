const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');

router.post('/login', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).json({
        success: false,
        errorMessage: error.details[0].message
    });

    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).json({
        success: false, 
        errorMessage: 'Invalid email or password'
    });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).json({
        success: false,
        errorMessage: 'Invalid email or password'
    });
    
    const token = user.generateAuthToken();
    res.status(200).header('x-auth-token', token).json(_.pick(user, ['name', 'email']));
    
});



module.exports = router;