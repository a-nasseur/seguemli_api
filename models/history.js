const mongoose = require('mongoose');


const histroySchema = new mongoose.Schema({
    user: String,
    createdDate: { 
        type: Date, 
        default: Date.now 
    },
    route: String,
    userAgent: String
});


const History = mongoose.model('History', histroySchema);




exports.History = History;

