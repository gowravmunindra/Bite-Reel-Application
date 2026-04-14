const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodpartner.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res){
    const{fullName, email, password} = req.body

    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.cookie('token',token, { httpOnly: true, secure: true, sameSite: 'none' })

    res.status(201).json({
        message: "User registered successfully",
        user : {
            _id : user._id,
            email : user.email,
            fullName : user.fullName
        }
    })
}

async function loginUser(req, res){
    const{email, password} = req.body;

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(404).json({
            message : "User doesn't exist"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message : "Invalid password"
        })
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });

    return res.status(200).json({
        message : "User logged in successfully",
        user : {
            _id : user._id,
            email : user.email,
            fullName : user.fullName
        }
    })
}

function logoutUser(req,res){
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).json({
        message: "user logged out successfully"
    })
}

async function registerFoodPartner(req,res){
    const {name, email, password, contactName, phone, address} = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({
        email
    })

    if(isAccountAlreadyExists){
        return res.status(400).json({
            message : "Partner already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password : hashedPassword,
        contactName,
        phone,
        address
    }) 

    const token = jwt.sign({id: foodPartner._id}, process.env.JWT_SECRET)

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' })

    res.status(201).json({
        message : "food partner registered successfully",
        foodPartner : {
            id : foodPartner._id,
            email : foodPartner.email,
            name : foodPartner.name,
            contactName : foodPartner.contactName,
            phone : foodPartner.phone,
            address : foodPartner.address
        }
    })
}

async function loginFoodPartner(req, res){
    const {email, password} = req.body;

    const foodPartner = await foodPartnerModel.findOne({
        email
    })

    if(!foodPartner){
        return res.status(404).json({
            message: "Food Partner doesn't exist"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid password"
        })
    }

    const token = jwt.sign({id: foodPartner._id}, process.env.JWT_SECRET);

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });

    res.status(200).json({
        message : "Food partner logged in successfully",
        foodPartner : {
            id : foodPartner._id,
            email : foodPartner.email,
            name : foodPartner.name
        }
    })
}

function logoutFoodPartner(req, res){
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).json({
        message : "Food partner logged out successfully"
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}