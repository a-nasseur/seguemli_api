const { Customer, validateCustomer } = require('../models/customer');
const { History } = require('../models/history');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

// AUTH MIDDLEWARE
const auth = require('../middleware/auth');

// ROLE MIDDLEWARES
const admin = require('../middleware/admin');


// ADD NEW CUSTOMER
router.post('/add-customer', auth, async (req, res) => {
    // Post customer data validation
    const { error } = validateCustomer(req.body);
    if(error) return res.status(400).json({
        success: false,
        errorMessage: error.details[0].message
    });

    // Check if customer already exist in the dabase
    // using the unique phone number as unique entry
    let customer = await Customer.findOne({ phone: req.body.phone });
    if(customer) return res.status(400).json({
        success: false,
        errorMessage: 'A customer is already registered with this phone number'
    });

    // adding the customer to the database
    let entry = new Customer(_.pick(req.body, ['firstName', 'lastName', 'email', 'phone']));
    entry = await entry.save();

    // Storing the API call in the history database
    let history = new History({
        user: req.user.name,
        route: req.route.path,
        userAgent: req.headers['user-agent']
    });
        history = await history.save();

    res.status(201).json({
        success: true,
        message: entry.firstName + ' was successfully registered',
        customer: _.pick(entry, ['firstName', 'lastName', 'email', 'phone'])})
});


// GET CUSTOMERS
router.get('/get-customers', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdDate: 'desc'});
        // const response = customers.map(customer => {
        //     return {
        //         _id: customer._id,
        //         firstName: customer.firstName,
        //         lastName: customer.lastName,
        //         email: customer.email,
        //         phone: customer.phone,
        //         repairs: customer.repairs
        //     };
        // });
        res.status(200).json({
            success: true,
            data: customers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            errorMessage: error.message
        });
    }
});


router.get('/get-customer/:id', async (req, res) => {
    let customer = await Customer.findOne({ _id: req.params.id });
    if(!customer) return res.status(404).send('User not found');

    res.status(200).send(customer);
});


// DELETE CUSTOMER
router.delete('/delete-customer/:id', [auth, admin], async (req, res) => {
    let customer = await Customer.findById({ _id: req.params.id });
    if(!customer) return res.status(400).json({
        success: false,
        errorMessage: 'No customer found with this phone number'
    });

    try {
        await customer.delete();
        res.status(204).json({succes: true, message: 'Customer deleted successfully'});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            errorMessage: 'an error happened during the process please try again later'
        });
    }
});




module.exports = router;