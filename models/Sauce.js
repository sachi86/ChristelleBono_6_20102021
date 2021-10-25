//Call the module mongoose for to use
const mongoose = require('mongoose');

//Allows you to model the data
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },// id of the user who created the sauce
    name: {type: String, required: true},// name of the sauce
    manufacturer: {type: String, required: true},// Manufacturer of the sauce
    description: {type: String, required: true},// Description of the sauce
    mainPepper: {type: String, required: true},// the main spicy ingredient in the sauce
    imageUrl: {type: String, required: true}, // Url of the sauce image uploaded by the user
    heat: {type: Number, required: true},// Number between 1 and 10 describing the sauce
    likes: {type: Number, required: true},// Number of users who like the sauce
    dislikes: {type: Number, required: true},// Number of users who don't like the sauce
    usersLiked: {type: Object, required:true},// array of user IDs who liked the sauce
    usersDisliked: {type:Object, required: true},// array of user IDs who Disliked the sauce
});

//exports the schema as a Mongoose model called "Sauce", thereby making it available to our application.
module.exports = mongoose.model('Sauce', sauceSchema);