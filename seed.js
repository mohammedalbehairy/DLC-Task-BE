const mongoose = require('mongoose')
const ObjectID = require('bson').ObjectID;
require('custom-env').env();
const {
    UserModel
} = require('./src/users/users_model')
const {
    CategoryModel
} = require('./src/categories/category_model')

async function seed() {

    await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    //#region Users

    if (await UserModel.countDocuments() > 0) {
        console.log('Admin Users - Already Exist');
        return;
    }
    //-------------------------------------------------------------------------------------//
    let admin = {
        email: 'admin@gmail.com',
        username: 'admin',
        isAdmin: true
    }

    admin = new UserModel(admin);
    admin.setPassword('Mo123456')

    await admin.save(admin);
    console.log('Admin User - Created Successfully');
    //-------------------------------------------------------------------------------------//
    let user1 = {
        email: 'mohammed@gmail.com',
        username: 'mohammed',
        isAdmin: false
    }

    user1 = new UserModel(user1);
    user1.setPassword('Mo123456')

    await user1.save(user1);
    console.log('User - Created Successfully');
    //-------------------------------------------------------------------------------------//
    let user2 = {
        email: 'ali@gmail.com',
        username: 'ali',
        isAdmin: false
    }

    user2 = new UserModel(user2);
    user2.setPassword('Mo123456')

    await user2.save(user2);
    console.log('User - Created Successfully');

    //#endregion Users
    //#region Categories

    if (await CategoryModel.countDocuments() > 0) {
        console.log('Categories - Already Exist');
        return;
    }
    //-------------------------------------------------------------------------------------//
    let category1 = {
        name: 'sport'
    }

    category1 = new CategoryModel(category1);

    await category1.save(category1);
    console.log('category - Created Successfully');
    //-------------------------------------------------------------------------------------//

    //-------------------------------------------------------------------------------------//
    let category2 = {
        name: 'art'
    }

    category2 = new CategoryModel(category2);

    await category2.save(category2);
    console.log('category - Created Successfully');

    //-------------------------------------------------------------------------------------//
    let category3 = {
        name: 'family'
    }

    category3 = new CategoryModel(category3);

    await category3.save(category3);
    console.log('category - Created Successfully');

    //#endregion Categories

    mongoose.disconnect();

}

seed()