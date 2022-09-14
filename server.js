const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const registration = require('./routes/registration');
const auth = require('./routes/auth');
const customers = require('./routes/customers');
const repairs = require('./routes/repairs');
const PORT = 3000 || process.env.PORT
require('dotenv').config();
const app = express();


// mongodb connection options
const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

mongoose.connect(process.env.DB_URI, options, (err) => {
    if(err){
        console.error(err.message);
    };

    console.log(`mongodb cluster connected successfully`);
});


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Cors middleware
app.use(cors());

app.use(morgan('dev'));

// Helmet Security middleware
app.use(helmet());

app.use('/api/v1/users', registration);
app.use('/api/v1/users', auth);
app.use('/api/v1/customers', customers);
app.use('/api/v1/repairs', repairs);


app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});


