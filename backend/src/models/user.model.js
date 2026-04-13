const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    fullName: {
        type: String,
        required : true
    },

    email : {
        type: String,
        unique : true,
        required : true
    },

    password : {
        type : String
    }
}, 
    {
        timestamps: true
    }
)

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
