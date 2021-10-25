const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace( '<PASSWORD>', process.env.DATABASE_PASSWORD );


//Call the express for to use
const express = require('express');

//Call the module mongoose for to use
const mongoose = require('mongoose');

const path = require('path'); 

//Call the file to have a defined routes
const userRoutes = require('./routes/user');

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


app.use('/images', express.static(path.join(__dirname, 'images')));

//app use to userRoute who defined the routes
app.use('/api/auth', userRoutes);

//app use to sauceRoute who defined the routes
app.use('/api/sauces', sauceRoutes);


//Allows to export the app
module.exports = app;
