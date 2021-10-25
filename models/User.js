//Call the module mongoose for to use
const mongoose = require('mongoose');

//// Check that the element is unique in the DB
const uniqueValidator = require('mongoose-unique-validator'); 

//Allows you to model the data
const userSchema = mongoose.Schema({
    email: {type: String, required:true, unique: true},//email which must be unique so that there are not several accounts in DB at the same email
    password: {type: String, required: true}//password who is hashed
});

userSchema.plugin(uniqueValidator);

//exports the schema as a Mongoose model called "User", thereby making it available to our application.
module.exports = mongoose.model('User', userSchema);