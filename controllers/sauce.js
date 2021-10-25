//Call the file to have the sauceSchema
const Sauce = require('../models/Sauce');

//Call fs to manage files to node
const fs = require('fs');

//Middleware for get all Sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()//Allows to find the list sauce
    .then((sauces) => {
      res.status(200).json(sauces);// response to request ok
    })
    .catch((error) => {
      res.status(400).json({// response error bad request
        error: error
      });
    }
    );
};

//Middleware for get one Sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findById(req.params.id)// Allows to find one sauce by Id
    .then((sauce) => {
      res.status(200).json(sauce);// response to request ok
    })
    .catch(
      (error) => {
        res.status(404).json({// response error not found the sauce
          error: error
        });
      }
    );
};

//Middleware for create/post a new sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);//transform a format JSON to a JS object
  const sauce = new Sauce({// create a new sauce models
    userId: sauceObject.userId,
    name: sauceObject.name,
    manufacturer: sauceObject.manufacturer,
    description: sauceObject.description,
    mainPepper: sauceObject.mainPepper,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //Allows to generate Url image
    heat: sauceObject.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce is created!' }))// response to create data
    .catch(error => res.status(400).json({ error }));// response error bad request
};

//Middleware to change elements of the sauce
exports.modifySauce = (req, res, next) => {
  if (req.file) { //if a image 
    Sauce.findById(req.params.id)// find one sauce by id 
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];//return the filename 
        fs.unlink(`images/${filename}`, () => { console.log('File of image is deleted!') });// To delete image 
      })
      .catch(error => res.status(400).json({ error }));//response error bad request
  }

  const sauceObject = req.file ?//If in the request have a file
    {
      name: JSON.parse(req.body.sauce).name, //trandform a format JSOn to Js object
      manufacturer: JSON.parse(req.body.sauce).manufacturer,
      description: JSON.parse(req.body.sauce).description,
      mainPepper: JSON.parse(req.body.sauce).mainPepper,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,// to generate a url image
      heat: JSON.parse(req.body.sauce).heat
    } : {
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      heat: req.body.heat
    };

  Sauce.updateOne({ _id: req.params.id }, sauceObject)// to update the sauce with a modification
    .then(res.status(200).json({ message: "Sauce modify!" }))// response resuqest ok
    .catch(error => res.status(400).json({ error }));// response bad request
};

//Middleware to delete sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findById(req.params.id) // find the sauce by id
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];// to return the filename
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id }) // delete the sauce
          .then(res.status(200).json({ message: "Sauce deleted!" }))// response request ok
          .catch(error => res.status(400).json({ error }));// response error bad request
      });
    })
    .catch(error => res.status(400).json({ error }));// response error bad request
};

//Middleware to manage the like/dislike 
exports.scoreSauce = (req, res, next) => {
  Sauce.findById(req.params.id)// find the sauce by id
    .then(sauce => {
      switch (req.body.like) {
        case 1:
          if (!sauce.usersLiked.includes(req.body.userId)) {// if in the array "userLiked" you don't find the user Id
            sauce.likes++;// to add like
            sauce.usersLiked.push(req.body.userId);// to add user id in the array "userLiked"
            Sauce.updateOne({ _id: req.params.id }, { likes: sauce.likes, usersLiked: sauce.usersLiked }) // to uspdate a like and array
              .then(res.status(200).json({ message: 'user Liked this sauce!' }))// response request ok
              .catch(error => res.status(400).json({ error }));// response error bad resquest
          }
          break;
        case 0:
          if (sauce.usersLiked.includes(req.body.userId)) {// if userId is find in the array "userLiked"
            let indexUsersLiked = sauce.usersLiked.indexOf(req.body.userId);//to search the index of userId in the array
            sauce.likes--;//remove a like 
            sauce.usersLiked.splice(indexUsersLiked, 1);// to remove the id with his index 
            Sauce.updateOne({ _id: req.params.id }, { likes: sauce.likes, usersLiked: sauce.usersLiked })// update the like and the array
              .then(res.status(200).json({ message: 'the user is  unliked this sauce!' }))//response request ok
              .catch(error => res.status(400).json({ error }));// response error bad request
          } else if (sauce.usersDisliked.includes(req.body.userId)) {// if userId is find in the array"userDisliked"
            let indexUsersDisliked = sauce.usersDisliked.indexOf(req.body.userId);//to search the index of userId in the array
            sauce.dislikes--;// to remove dislike
            sauce.usersDisliked.splice(indexUsersDisliked, 1);//to remove userId in the array with his index
            Sauce.updateOne({ _id: req.params.id }, { Dislikes: sauce.Dislikes, usersDisliked: sauce.usersDisliked })// uspdate the dislike and the array
              .then(res.status(200).json({ message: 'the user is  undisliked this sauce!' }))// response request ok
              .catch(error => res.status(400).json({ error }));// response error bad request
          }
          break;
        case -1:
          if (!sauce.usersDisliked.includes(req.body.userId)) {// if don't find a userId in the array 'userDislekd
            sauce.dislikes++;// add a dislike
            sauce.usersDisliked.push(req.body.userId);// add the array "userDisliked"
            Sauce.updateOne({ _id: req.params.id }, { dislikes: sauce.dislikes, usersDisliked: sauce.usersDisliked })// update a disliked and the array
              .then(res.status(200).json({ message: 'user disliked this sauce!' }))// response request ok
              .catch(error => res.status(400).json({ error }));// response error bad request
          }
      }
    })
    .catch(error => res.status(400).json({ error }));// response error bad request
};