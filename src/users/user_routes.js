const router = require('express').Router();
const userService = require('./user_service');

// get users
router.get('/', async (req, res, next) => {
    try {
        users = await userService.getUsers(req.query.email);

        return res.status(200).send(users);
    } catch (e) {
        return next(e)
    }
});

// get user details
router.get('/:id', async (req, res, next) => {
    try {

        userService.validateUserId(req.params.id);

        const user = await userService.getUser(req.params.id);

        return res.status(200).send(user);
    } catch (e) {
        return next(e)
    }
});

// create user
router.post('/', async (req, res, next) => {
    try {

        //await userService.validateCreateUser(req.body);

        await userService.createUser(req.body);

        return res.status(201).send({
            message: 'user created successfully'
        });
    } catch (e) {
        return next(e)
    }
});

// edit user
router.put('/:id', async (req, res, next) => {
    try {

        //await userService.validateCreateUser(req.body);

        await userService.editUser(req.body, req.params.id);

        return res.status(201).send({
            message: 'user updated successfully'
        });
    } catch (e) {
        return next(e)
    }
});

// delete user
router.delete('/:id', async (req, res, next) => {
    try {

        userService.validateUserId(req.params.id);

        await userService.deleteUser(req.params.id);

        return res.status(200).send({
            message: 'user deleted successfully'
        });
    } catch (e) {
        return next(e)
    }
});

module.exports = router;