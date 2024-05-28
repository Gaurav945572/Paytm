const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://gauravopopo9455:Gauravoppo9455@cluster0.dhldjek.mongodb.net/user")

// Create a Schema for Users
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

const AccountSchema= new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }

})

// Create a model from the schema
const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account',AccountSchema);

module.exports = {
	User,
    Account
};