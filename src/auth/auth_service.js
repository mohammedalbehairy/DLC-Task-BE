const Joi = require("@hapi/joi");
const ErrorHandler = require('../errors/ErrorHandler');
const {
    UserModel
} = require('../users/user_model')

// login routes functions
async function validateUser(body) {
    const validateUserSchema = Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6).max(40)
    }).unknown();

    const {
        value,
        error
    } = validateUserSchema.validate(body, {
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
    let user = await UserModel.findOne({
        email: body.email
    }, '-name -createdById -__v')

    if (!user) throw new ErrorHandler(400, {
        message: "invalid user email or/and password"
    })

    user = new UserModel(user);

    if (!user.validatePassword(body.password)) throw new ErrorHandler(400, {
        message: "invalid user email or/and password"
    })

    return user;

}

async function login(user) {
    const token = user.generateJWT();
    return {
        bearer: token,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin
    }
}

//user register functions
async function validateRegister(body) {

    const validateUserSchema = Joi.object().keys({
        email: Joi.string().required().email(),
        username: Joi.string().required().min(3).max(25),
        password: Joi.string().required().min(6).max(40)
    }).unknown();

    const {
        value,
        error
    } = validateUserSchema.validate(body, {
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

    if (await UserModel.countDocuments({
            email: body.email
        }) > 0)
        throw new ErrorHandler(400, {
            message: "email already exist in users"
        })

    if (await UserModel.countDocuments({
            username: body.username
        }) > 0)
        throw new ErrorHandler(400, {
            message: "username already exist in users"
        })

    return undefined;

}

async function createUser(body) {
    const {
        email,
        username,
        password
    } = body;
    const user = new UserModel({
        email,
        username
    })
    user.isAdmin = false;
    user.setPassword(password)
    return await user.save()
}

module.exports.validateUser = validateUser;
module.exports.login = login;
module.exports.validateRegister = validateRegister;
module.exports.createUser = createUser;