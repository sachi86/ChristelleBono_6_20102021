//Call the file to have the userSchema
const User = require('../models/User');

//Call the module of bcrypt for hashed the password
const bcrypt = require('bcrypt');

//Call the module of jsonwebtoken for token management
const jwt = require('jsonwebtoken');

//Call to dotenv 
const dotenv = require('dotenv');

//Call to function of dotenv config
dotenv.config({ path: './config.env' });


//Allows you to create a new user
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //Allows you to hash the password
    .then( hash =>{
        const user = new User({// create a new user with the userSchema
            email: req.body.email,//Get the email in the request's body
            password: hash//Get the password hash
        });
        user.save()//Allows you to save this new user
        .then(() => res.status(201).json({ message:'User created!' }))// response create data
        .catch(error => res.status(400).json({ error }));// response error bad request
    })
    .catch(error => res.status(500).json({ error }));// response error server problem
};

//Allows you to connect with your identifiers 
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })//Allows you to find the email passed in the request in the database
    .then(user =>{
        if(!user){
            return res.status(401).json({ error: 'User no found!' });//The email isn't in the database error unauthorized
        }
        bcrypt.compare(req.body.password, user.password)// Compare to password passed in the request in the hash in the database
        .then(valid => {
            if(!valid){//it's not valid
                return res.status(401).json({ error: 'Pasword inccorect!' });//response error unauthorized
            }
            res.status(200).json({//is valid
                userId: user._id, //get the user id 
                token: jwt.sign( //function to create a token which will be used for the authentication of a user
                    { userId : user._id },//data to encode
                    process.env.JWT_SECRET,//encoding key
                    { expiresIn :'24h'}//token expiration
                )
            });
        })
        .catch(error => res.status(500).json({ error }));// response error server problem
    })
    .catch(error => res.status(500).json({ error }));// response error server problem
};

