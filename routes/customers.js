const { Customer, validate } = require('../models/customer');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

// AUTH MIDDLEWARE
const auth = require('../middleware/auth');

// ROLE MIDDLEWARES
const admin = require('../middleware/admin');


// ADD NEW CUSTOMER
router.post('/add-customer', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findOne({ phone: req.body.phone });
    if(customer) return res.status(400).send('A user is already registered with this phone number');

    let entry = new Customer(_.pick(req.body, ['firstName', 'lastName', 'email', 'phone']));
    entry = await entry.save();

    res.status(201).send(_.pick(entry, ['firstName', 'lastName', 'email', 'phone']));
});


// GET CUSTOMERS
router.get('/get-customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        const response = customers.map(customer => {
            return {
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone
            };
        });
        res.status(200).send(response);
    } catch (error) {
        res.send(error.message);
    }
});


// DELETE CUSTOMER
router.delete('/delete-customer/:phone', [auth, admin], async (req, res) => {
    let customer = await Customer.findOne({ phone: req.params.phone });
    if(!customer) return res.status(400).send('No customer found with this phone number');

    try {
        await customer.delete();
        res.status(204).json({succes: true, message: 'Customer deleted successfully'});
    } catch (error) {
        console.log(error.message);
        res.status(500).send('un error happened during the process please try again later')
    }
});




module.exports = router;