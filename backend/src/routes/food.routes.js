const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const foodController = require('../controller/food.controller')
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
});

//api/food/[protected]
router.post('/', 
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("video"),
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