const { Customer, validateRepair } = require('../models/customer');
const express = require('express');
const router = express.Router();
const _ = require('lodash');


const auth = require('../middleware/auth');


router.post('/add-repair', auth, async (req, res) => {
    const { error } = validateRepair(req.body);
    if(error) return res.status(400).json({
        success: false,
        errorMesssage: error.details[0].message
    });

    let customer = await Customer.findByIdAndUpdate({ _id: req.body.id });
    if(!customer) return res.status(400).json({
        success: false,
        errorMesssage: 'no customer with this phone number, please register the customer first'
    });

    await customer.repairs.push(_.pick(req.body, ['item', 'category', 'serialNumber', 'brand', 'damageDescription']));
    await customer.save();
    res.status(201).json({
        success: true,
        message: 'New repair added successfully',
        data: (_.pick(customer, ['firstName', 'lastName', 'email', 'phone', 'repairs']))
    })
});



module.exports = router;