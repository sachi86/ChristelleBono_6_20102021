//Call to espress of node
const express = require('express');

// Call to function router
const router = express.Router();

//Call the fils to have logic of sauce's routes
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');

//Call the file to have a multer configuration
const multer = require('../middleware/multer-config');


//Defined get getAllSauce route with the methode get
router.get('/', auth, sauceCtrl.getAllSauces);

//Defined get getOne route with the methode get
router.get('/:id', auth, sauceCtrl.getOneSauce);

//Defined get createSauce route with the methode post 
router.post('/', auth, multer, sauceCtrl.createSauce); 

//Defined get modifySauce route with the methode put
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

//Defined get deleteSauce route with the methode delete
router.delete('/:id', auth, sauceCtrl.deleteSauce);

//Defined get scoreSauce route with the methode post 
router.post('/:id/like', auth, sauceCtrl.scoreSauce); 

module.exports = router;