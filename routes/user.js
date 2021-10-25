
//Call the  express for use
const express = require('express');

//Call the method router
const router = express.Router();

//Call the fils to have logic of user's routes
const userCtrl = require('../controllers/user'); 

//Defined route signup with the methode post 
router.post('/signup', userCtrl.signup); 

//Defined route login with the methode post 
router.post('/login', userCtrl.login); 

//Export the methode router
module.exports = router;