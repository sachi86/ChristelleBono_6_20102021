//Call the file to have the userSchema
const User = require('../models/User');

//Call the module of bcrypt for hashed the password
const bcrypt = require('bcrypt');

//Call the module of jsonwebtoken for token management
const jwt = require('jsonwebtoken');



//Allows you to create a new user
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //Allows you to hash the password
    .then( hash =>{
        const user = new User({// create a new user with the userSchema
            email: req.body.email,//Get the email in the request's body
            password: hash//Get the password hash
        });
        user.save()//Allows you to save this new user
        .then(() => res.status(201).json({ message:'User created!' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//Allows you to connect with your identifiers 
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })//Allows you to find the email passed in the request in the database
    .then(user =>{
        if(!user){
            return res.status(401).json({ error: 'User no found!' });//The email isn't in the database
        }
        bcrypt.compare(req.body.password, user.password)// Compare to password passed in the request in the hash in the database
        .then(valid => {
            if(!valid){//it's not valid
                return res.status(401).json({ error: 'Pasword inccorect!' });
            }
            res.status(200).json({//is valid
                userId: user._id, //get the user id 
                token: jwt.sign( //function to create a token which will be used for the authentication of a user
                    { userId : user._id },//data to encode
                    'CREATE_SECRET_TOKEN_KEY',//encoding key
                    { expiresIn :'24h'}//token expiration
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

