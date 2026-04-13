const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err) =>{
        console.log("MongoDb connection error:",err);
    })
}

module.exports = connectDB;