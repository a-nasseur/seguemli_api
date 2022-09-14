const { Customer, validateRepair } = require('../models/customer');
const express = require('express');
const router = express.Router();
const _ = require('lodash');


const auth = require('../middleware/auth');


router.post('/add-repair', auth, async (req, res) => {
    const { error } = validateRepair(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findOne({ phone: req.body.phone });
    if(!customer) return res.status(400).send('no customer with this phone number, please register the customer first');

    await customer.repairs.push(_.pick(req.body, ['item', 'category', 'serialNumber', 'damageDescription']));
    res.status(201).send(_.pick(customer, ['firstName', 'lastName', 'email', 'phone', 'repairs']))
});



module.exports = router;