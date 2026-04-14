const { get } = require('mongoose');
const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');
const {v4 : uuid} = require('uuid');

async function deleteFood(req, res){
    const { id } = req.params;
    
    try {
        const foodItem = await foodModel.findById(id);
        
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }
        
        if (foodItem.foodPartner.toString() !== req.foodPartner._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this food item" });
        }
        
        await foodModel.findByIdAndDelete(id);
        await likeModel.deleteMany({ food: id });
        await saveModel.deleteMany({ food: id });
        
        return res.status(200).json({ message: "Food item deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function createFood(req, res){
    try {
        console.log("Partner:", req.foodPartner?._id);
        console.log("Body:", req.body);
        console.log("File:", req.file ? "File present" : "No file");

        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: "Video file is required." });
        }

        const originalName = req.file.originalname.replace(/\\s+/g, '_');
        const fileName = `${uuid()}_${originalName}`;
        const fileUploadResult = await storageService.uploadFile(req.file.buffer, fileName);

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id
        });

        res.status(201).json({
            message: "food created sucessfully",
            food : foodItem
        });
    } catch (error) {
        console.error("Error creating food item:", error);
        res.status(500).json({ 
            message: "Internal server error during food creation", 
            error: error.message 
        });
    }
}

async function getFoodItems(req, res){
    const user = req.user;
    const foodItems = await foodModel.find({}).populate('foodPartner', 'name contactName phone address');

    const userLikes = await likeModel.find({ user: user._id });
    const userSaves = await saveModel.find({ user: user._id });

    const likedFoodIds = userLikes.map(like => like.food.toString());
    const savedFoodIds = userSaves.map(save => save.food.toString());

    const formattedFoodItems = foodItems.map(item => {
        return {
            ...item.toObject(),
            likes: likedFoodIds.includes(item._id.toString()) ? [user._id] : [],
            saves: savedFoodIds.includes(item._id.toString()) ? [user._id] : [],
            currentUser: user._id
        }
    });

    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems: formattedFoodItems
    })
}

async function likeFood(req, res){
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if(isAlreadyLiked){
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({ 
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    return res.status(201).json({
        message: "Food liked successfully",
        like
    })
}

async function saveFood(req, res){
    const { foodId } = req.body;
    const user = req.user;  

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if(isAlreadySaved){
        await saveModel.deleteOne({ 
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { saveCount: -1 }
        })

        return res.status(200).json({
            message: "Food unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { saveCount: 1 }
    })  

    res.status(201).json({
        message: "Food saved successfully",
        save
    })  
}

async function getSaveFood(req, res){
    const user = req.user;
    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if(!savedFoods || savedFoods.length === 0){
        return res.status(404).json({
            message: "No saved food items found"
        });
    }

    res.status(200).json({
        message: "Saved food items retrieved successfully",
        savedFoods
    });
    
}
module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood,
    deleteFood
}