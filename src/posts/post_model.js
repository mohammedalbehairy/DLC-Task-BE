const mongoose = require('mongoose');
const ObjectID = require('bson').ObjectID;

const { Schema } = mongoose;

const PostsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    categoryId: {
        type: ObjectID,
        required: true,
        ref: 'Categories'
    },
    createdById: {
        type: ObjectID,
        required: true,
        ref: 'Users'
    },
    createdOn: {
        type: Date
    }
});


const PostModel = mongoose.model('Posts', PostsSchema);



exports.PostModel = PostModel;