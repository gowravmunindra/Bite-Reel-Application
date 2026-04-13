const mongoose = require('mongoose');

const foodPartnerSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    contactName :{
        type : String,
        required : true
    },

    phone : {
        type : String,
        required : true
    },

    address : {
        type : String,
        required : true    
    },

    email : {
        type : String,
        required : true,
        unique : true
    },

    profileImage: {
        type: String,
        default: "https://images.unsplash.com/photo-1760883956955-31d8adb4e6d9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=600"
    },

    password : {
        type : String,
        requierd : true
    }
})

const foodPartnerModel = mongoose.model('foodpartner', foodPartnerSchema);

module.exports = foodPartnerModel;