const mongoose = require('mongoose');
const ObjectID = require('bson').ObjectID;

const {
    Schema
} = mongoose;

const CategoriesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});


const CategoryModel = mongoose.model('Categories', CategoriesSchema);



exports.CategoryModel = CategoryModel;