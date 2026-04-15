const foodModel = require('../models/food.model');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');
const ImageKit = require('imagekit');

const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Provides short-lived auth params so the frontend can upload directly to ImageKit.
// We also return publicKey so the frontend doesn't need its own env variable.
function imageKitAuth(req, res) {
    try {
        const authParams = imageKit.getAuthenticationParameters();
        res.status(200).json({
            ...authParams,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate ImageKit auth token' });
    }
}

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

// Server-side upload: receives the video via multer, uploads to ImageKit from the backend.
// This is simpler and more reliable than a 3-step client-side flow.
async function createFood(req, res){
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: "Video file is required." });
        }

        if (!req.body.name || !req.body.description) {
            return res.status(400).json({ message: "Name and description are required." });
        }

        // Sanitise the filename (replace whitespace with underscores)
        const safeName = req.file.originalname.replace(/\s+/g, '_');
        const fileName = `${Date.now()}_${safeName}`;

        const uploadResult = await imageKit.upload({
            file: req.file.buffer,
            fileName: fileName,
        });

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: uploadResult.url,
            foodPartner: req.foodPartner._id
        });

        res.status(201).json({
            message: "Food created successfully",
            food: foodItem
        });
    } catch (error) {
        console.error("createFood error:", error.message);
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