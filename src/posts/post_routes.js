const router = require('express').Router();
const postService = require('./post_service');
const authenticationMiddleware = require('../middlewares/authenticationMiddleware');


// get all posts
router.get('/', async (req, res, next) => {
    try {

        const posts = await postService.getPosts(req.query.body, req.query.userId, req.query.categoryId);

        return res.status(200).send(posts);
    } catch (e) {
        return next(e)
    }
});

// get my posts
router.get('/my-posts', authenticationMiddleware, async (req, res, next) => {
    try {

        const posts = await postService.getMyPosts(req.user._id, req.query.bodyWords,req.query.categoryId);

        return res.status(200).send(posts);
    } catch (e) {
        return next(e)
    }
});

// get post by id
router.get('/:id', async (req, res, next) => {
    try {

        const post = await postService.getPostById(req.params.id);

        return res.status(200).send(post);
    } catch (e) {
        return next(e)
    }
});

// use authentication middleware
router.use(authenticationMiddleware);



// create a post
router.post('/', async (req, res, next) => {
    try {

        await postService.validateCreatePost(req.body);

        await postService.createPost(req.body, req.user._id);

        return res.status(201).send({
            message: 'post created successfully'
        });
    } catch (e) {
        return next(e)
    }
});

// update post
router.put('/:id', async (req, res, next) => {
    try {

        await postService.validateEditPost(req.body, req.params.id);

        await postService.editPost(req.body, req.params.id, req.user._id, req.user.isAdmin);

        return res.status(200).send({
            message: 'post updated successfully'
        });
    } catch (e) {
        return next(e)
    }
});

// delete post
router.delete('/:id', async (req, res, next) => {
    try {

        await postService.validatePostId(req.params.id);

        await postService.deletePost(req.params.id, req.user._id, req.user.isAdmin);

        return res.status(200).send({
            message: 'post deleted successfully'
        });
    } catch (e) {
        return next(e)
    }
});

module.exports = router;