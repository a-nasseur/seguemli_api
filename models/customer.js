const mongoose = require('mongoose');
const Joi = require('joi');


const repairSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    category: {
        type: String,
        required: true, 

    },
    serialNumber: {
        type: String,
        required: false,
        unique: true, 
        minlength: 3,
        maxlength: 250
    },
    damageDescription: {
        type: String,
        required: true, 
        minlength: 5,
    },

    createdDate: {
        type: Date,
        default: Date.now
    }
});



const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    email: {
        type: String,
        required: false,
        unique: true,
        minlength: 5,
        maxlength: 250
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10
    },
    repairs: [repairSchema],
    createdDate: { 
        type: Date, 
        default: Date.now 
    }
});


const Customer = mongoose.model('Customer', customerSchema);

const validateCustomer = (customer) => {
    const schema = Joi.object({
        firstName: Joi.string().min(4).max(50).required(),
        lastName: Joi.string().min(4).max(50).required(),
        email: Joi.string().min(5).max(250).required().email(),
        phone: Joi.string().length(10).required(),
        
    });

    return schema.validate(customer);
};


const validateRepair = (repair) => {
    const schema = Joi.object({
        item: Joi.string().min(4).max(50).required(),
        category: Joi.string().min(4).max(50).required(),
        serialNumber: Joi.string().min(3).max(250),
        damageDescription: Joi.string().min(5).required(),
        phone: Joi.string().length(10).required(),
    });

    return schema.validate(repair);
};


exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
exports.validateRepair = validateRepair;