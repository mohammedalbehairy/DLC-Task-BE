const Joi = require("@hapi/joi");
const ErrorHandler = require('../errors/ErrorHandler');
const validateObjectId = require('../helpers/validateObjectId');
const {
    PostModel
} = require('./Post_model')
const {
    CategoryModel
} = require('../categories/category_model')
const {
    UserModel
} = require('../users/user_model')


async function getPosts(body, userId, categoryId) {

    let query = {}

    if (body) {
        query.body = {
            $regex: new RegExp(body, "i")
        };
    }

    if (userId) {
        validateObjectId(userId)
        query.createdById = userId;
    }
    if (categoryId) {
        validateObjectId(categoryId)
        query.categoryId = categoryId;
    }

    return await PostModel.find(query).populate('categoryId', 'name');
}

async function getPostById(id) {
    return await PostModel.findById(id).populate('categoryId', 'name').populate('createdById', 'username');
}

async function getMyPosts(userId, bodyWords, categoryId) {
    let query = {
        createdById: userId
    }

    if (bodyWords != 'undefined') {
        query.body = {
            $regex: new RegExp(bodyWords, "i")
        };
    }
    // if (categoryId != 'undefined') {
    //     validateObjectId(categoryId)
    //     query.categoryId = categoryId;
    // }

    return await PostModel.find(query).populate('categoryId', 'name');
}

// create post functions
async function validateCreatePost(bodyData) {

    const validatePostSchema = Joi.object().keys({
        title: Joi.string().required().min(3).max(25),
        body: Joi.string().required(),
    }).unknown();

    const {
        value,
        error
    } = validatePostSchema.validate(bodyData, {
        abortEarly: false
    });
    if (error) {
        const messages = error.details.map(i => {
            let e = {};
            e[i.context.key] = i.message.replace(/\"/g, '');
            return e;
        })
        throw new ErrorHandler(400, messages)
    }

    if (await PostModel.countDocuments({
            title: bodyData.title
        }) > 0)
        throw new ErrorHandler(400, {
            message: "post title already exist"
        })

    if (await CategoryModel.countDocuments({
            _id: bodyData.categoryId
        }) == 0)
        throw new ErrorHandler(400, {
            message: "categoryId not exist in categories"
        })

    return undefined;

}

async function createPost(bodyDataData, userId) {
    const {
        title,
        body,
        categoryId
    } = bodyDataData;
    const post = new PostModel({
        title,
        body,
        categoryId
    })
    post.createdById = userId;
    post.createdOn = new Date().setHours(new Date().getHours() + new Date().getTimezoneOffset() / -60);
    await post.save()

}

// update post functions
async function validateEditPost(bodyData, post) {

    validateObjectId(post)

    const validatePostSchema = Joi.object().keys({
        title: Joi.string().required().min(3).max(25),
        body: Joi.string().required(),
    }).unknown();

    const {
        value,
        error
    } = validatePostSchema.validate(bodyData, {
        abortEarly: false
    });
    if (error) {
        const messages = error.details.map(i => {
            let e = {};
            e[i.context.key] = i.message.replace(/\"/g, '');
            return e;
        })
        throw new ErrorHandler(400, messages)
    }

    if (await CategoryModel.countDocuments({
            _id: bodyData.categoryId
        }) == 0)
        throw new ErrorHandler(400, {
            message: "categoryId not exist in categories"
        })

    return undefined;

}

async function editPost(bodyData, postId, userId, isAdmin) {
    const {
        title,
        body,
        categoryId
    } = bodyData;
    let query = {
        _id: postId
    }
    if (!isAdmin) {
        query.createdById = userId;
    }
    const post = await PostModel.findOneAndUpdate(query, {
        title: title,
        body: body,
        categoryId: categoryId
    }, {
        new: true
    })

    if (!post)
        throw new ErrorHandler(404, {
            message: "The post with thie given id not found ."
        })

    return undefined

}
///////////

// delete post functions
async function validatePostId(postId) {
    validateObjectId(postId)
}

async function deletePost(postId, userId, isAdmin) {

    let query = {
        _id: postId
    }
    if (!isAdmin) {
        query.createdById = userId;
    }
    const post = await PostModel.findOneAndRemove(query)

    if (!post)
        throw new ErrorHandler(404, {
            message: "The post with thie given id not found ."
        })

    return undefined

}

////////////////



module.exports.getPosts = getPosts;
module.exports.getPostById = getPostById;

module.exports.getMyPosts = getMyPosts;

module.exports.validateCreatePost = validateCreatePost;
module.exports.createPost = createPost;

module.exports.validateEditPost = validateEditPost;
module.exports.editPost = editPost;

module.exports.validatePostId = validatePostId;
module.exports.deletePost = deletePost;