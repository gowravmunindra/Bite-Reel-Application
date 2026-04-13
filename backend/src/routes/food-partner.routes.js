const express = require('express');
const foodPartnerController = require('../controller/food-partner.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});
 
router.get("/:id",
    authMiddleware.authUserMiddleware,
    foodPartnerController.getFoodPartnerById
);

router.put("/update",
    authMiddleware.authFoodPartnerMiddleware,
    upload.single('profileImage'),
    foodPartnerController.updateProfile
);

module.exports = router;    