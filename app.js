//Call to dotenv 
const dotenv = require('dotenv');

//Call to function of dotenv config
dotenv.config({ path: './config.env' });

//Varible to identifiers Mongo DB with fonction dotenv replace
const DB = process.env.DATABASE.replace( '<PASSWORD>', process.env.DATABASE_PASSWORD );


//Call the express for to use
const express = require('express');

//Call the module mongoose for to use
const mongoose = require('mongoose');

//Call the module path for use
const path = require('path'); 

//Call the file to have  defined user routes
const userRoutes = require('./routes/user');

//Call the file to have defined sauce routes
const sauceRoutes = require('./routes/sauce');


//Allows to conncet in MongoDB
mongoose.connect(DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//App use the method express
const app = express();

//Allows to manage the authorization
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');//authorization from all origins
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');//authorization of all listed headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//authorization of all listed methods
  next();
});

//app use to express formated json
app.use(express.json());

//app use to module path 
app.use('/images', express.static(path.join(__dirname, 'images')));

//app use to userRoute who defined the routes
app.use('/api/auth', userRoutes);

//app use to sauceRoute who defined the routes
app.use('/api/sauces', sauceRoutes);


//Allows to export the app
module.exports = app;
