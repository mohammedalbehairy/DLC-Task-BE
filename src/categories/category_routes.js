const router = require('express').Router();
const categoriesService = require('./category_service');

// get categories
router.get('/', async (req, res, next) => {
    try {

        const users = await categoriesService.getCategories();

        return res.status(200).send(users);
    } catch (e) {
        return next(e)
    }
});

module.exports = router;