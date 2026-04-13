const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require('uuid');

async function getFoodPartnerById(req, res) {
    const foodPartnerId = req.params.id;
    
    const foodPartner = await foodPartnerModel.findById(foodPartnerId);
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId });

    if(!foodPartner){
        return res.status(404).json({
            message: "Food Partner not found"
        });
    }

    res.status(200).json({
        message: "Food Partner retrieved successfully",
        foodPartner : {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }
    })
    
}

async function updateProfile(req, res) {
    const foodPartnerId = req.foodPartner._id;
    const { name, contactName, phone, address } = req.body;
    let updateData = {};

    if (name) updateData.name = name;
    if (contactName) updateData.contactName = contactName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    try {
        if (req.file) {
            const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());
            updateData.profileImage = fileUploadResult.url;
        }

        const updatedPartner = await foodPartnerModel.findByIdAndUpdate(foodPartnerId, updateData, { new: true });
        return res.status(200).json({ 
            message: "Profile updated successfully", 
            foodPartner: updatedPartner 
        });
    } catch (err) {
        console.error("Update error:", err);
        return res.status(500).json({ message: "Error updating profile" });
    }
}

module.exports = {
    getFoodPartnerById,
    updateProfile
}