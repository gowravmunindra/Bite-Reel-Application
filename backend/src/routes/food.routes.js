const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const foodController = require('../controller/food.controller')

// GET /api/food/auth-token
// Returns short-lived ImageKit auth params for direct client-side upload
router.get('/imagekit-auth',
    authMiddleware.authFoodPartnerMiddleware,
    foodController.imageKitAuth
);

// POST /api/food  — now accepts JSON { name, description, videoUrl }
// Video is uploaded directly from the browser to ImageKit; only the URL is sent here.
router.post('/', 
    authMiddleware.authFoodPartnerMiddleware,
    foodController.createFood
);

router.get('/',
    authMiddleware.authUserMiddleware,
    foodController.getFoodItems
);

router.post('/like', 
    authMiddleware.authUserMiddleware, 
    foodController.likeFood
);

router.post('/save',
    authMiddleware.authUserMiddleware,
    foodController.saveFood
);

router.get('/save',
    authMiddleware.authUserMiddleware,
    foodController.getSaveFood
)

router.delete('/:id',
    authMiddleware.authFoodPartnerMiddleware,
    foodController.deleteFood
);

module.exports = router;