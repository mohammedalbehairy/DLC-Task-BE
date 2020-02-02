const Joi = require("@hapi/joi");
const ErrorHandler = require('../errors/ErrorHandler');
const validateObjectId = require('../helpers/validateObjectId');
const {
    UserModel
} = require('./user_model')


async function getUsers(username) {
    let query = {};

    if (username) {
        query.username = {
            $regex: new RegExp(username, "i")
        };
    }

    return await UserModel.find(query);
}

async function getUser(id) {

    return await UserModel.findById(id).select('email username isAdmin');
}

function validateUserId(userId) {
    validateObjectId(userId)
}

async function deleteUser(userId) {

    const user = await UserModel.findOneAndRemove({
        _id: userId
    })

    if (!user)
        throw new ErrorHandler(404, {
            message: "The user with thie given id not found ."
        })

    return undefined

}

// create post functions
// async function validateCreatePost(bodyData) {

//     const validatePostSchema = Joi.object().keys({
//         title: Joi.string().required().min(3).max(25),
//         body: Joi.string().required(),
//     }).unknown();

//     const {
//         value,
//         error
//     } = validatePostSchema.validate(bodyData, {
//         abortEarly: false
//     });
//     if (error) {
//         const messages = error.details.map(i => {
//             let e = {};
//             e[i.context.key] = i.message.replace(/\"/g, '');
//             return e;
//         })
//         throw new ErrorHandler(400, messages)
//     }

//     if (await PostModel.countDocuments({
//             title: bodyData.title
//         }) > 0)
//         throw new ErrorHandler(400, {
//             message: "post title already exist"
//         })

//     if (await CategoryModel.countDocuments({
//             _id: bodyData.categoryId
//         }) == 0)
//         throw new ErrorHandler(400, {
//             message: "categoryId not exist in categories"
//         })

//     return undefined;

// }

async function createUser(bodyData) {
    const {
        username,
        email,
        isAdmin
    } = bodyData;
    const user = new UserModel({
        username,
        email,
        isAdmin
    })
    user.setPassword(bodyData.password);
    await user.save()

}

async function editUser(bodyData, userId) {
    const {
        username,
        email,
        isAdmin
    } = bodyData;
    let query = {
        _id: userId
    }
    //TODO add edit password
    const user = await UserModel.findOneAndUpdate(query, {
        username,
        email,
        isAdmin
    }, {
        new: true
    })

    if (!user)
        throw new ErrorHandler(404, {
            message: "The user with thie given id not found ."
        })

    return undefined

}


module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.createUser = createUser;
module.exports.editUser = editUser;
module.exports.validateUserId = validateUserId;
module.exports.deleteUser = deleteUser;