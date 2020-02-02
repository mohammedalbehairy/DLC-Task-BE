const Joi = require("@hapi/joi");
const ErrorHandler = require('../errors/ErrorHandler');
const validateObjectId = require('../helpers/validateObjectId');
const { CategoryModel } = require('../categories/category_model')


async function getCategories() {
  
    return await CategoryModel.find({}).select('-__v');
}

module.exports.getCategories = getCategories;