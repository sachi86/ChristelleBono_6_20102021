//Call the file to have the sauceSchema
const Sauce = require('../models/Sauce');

const fs = require('fs');

//Middleware for get all Sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauces) => {
        res.status(200).json(sauces);
      })
    .catch((error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

//Middleware for get one Sauce
  exports.getOneSauce = (req, res, next) => {
    Sauce.findById(req.params.id)
    .then((sauce) => {
        res.status(200).json(sauce);
      })
    .catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };
 
//Middleware for create/post a new sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        userId:sauceObject.userId,
        name: sauceObject.name,
        manufacturer:sauceObject.manufacturer ,
        description:sauceObject.description ,
        mainPepper:sauceObject.mainPepper,
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
        heat: sauceObject.heat,
        likes: 0,
        dislikes:0,
        usersLiked: [],
        usersDisliked:[]
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce is created!' }))
        .catch(error => res.status(400).json({ error }));
};

//Middleware to change elements of the sauce
exports.modifySauce = (req, res, next) => {
  if(req.file){ 
      Sauce.findById(req.params.id) 
      .then(sauce => {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {console.log('File of image is deleted!')});
      })
      .catch(error => res.status(400).json({error}));
  }

  const sauceObject = req.file ?
  {
      name: JSON.parse(req.body.sauce).name, 
      manufacturer: JSON.parse(req.body.sauce).manufacturer,
      description: JSON.parse(req.body.sauce).description, 
      mainPepper: JSON.parse(req.body.sauce).mainPepper,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      heat: JSON.parse(req.body.sauce).heat
  } : {
      name: req.body.name, 
      manufacturer: req.body.manufacturer,
      description: req.body.description, 
      mainPepper: req.body.mainPepper,
      heat: req.body.heat
  };

  Sauce.updateOne({_id: req.params.id}, sauceObject)
      .then(res.status(200).json({message: "Sauce modify!"}))
      .catch(error => res.status(400).json({error}));
};

//Middleware to delete sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findById(req.params.id) 
      .then(sauce => {
          const filename = sauce.imageUrl.split('/images/')[1]; 
          fs.unlink(`images/${filename}`, () =>{ 
              Sauce.deleteOne({_id: req.params.id}) 
                  .then(res.status(200).json({message: "Sauce deleted!"}))
                  .catch(error => res.status(400).json({error}));
          });
      })
      .catch(error => res.status(400).json({error}));
};

//Middleware to manage the like/dislike 
exports.scoreSauce = (req, res, next)=> {
   Sauce.findById(req.params.id)
    .then( sauce =>{
      switch(req.body.like){
        case 1:
          if (!sauce.usersLiked.includes(req.body.userId)){
            sauce.likes++;
            sauce.usersLiked.push(req.body.userId);
            Sauce.updateOne({_id: req.params.id}, {likes:sauce.likes, usersLiked: sauce.usersLiked})
              .then( res.status(200).json({ message: 'user Liked this sauce!'}))
              .catch(error => res.status(400).json({error}));
            console.log(req.body.like);
          }
          break;
        case 0:
          if (sauce.usersLiked.includes(req.body.userId)){
            let indexUsersLiked = sauce.usersLiked.indexOf(req.body.userId);
            sauce.likes--;
            sauce.usersLiked.splice(indexUsersLiked,1);
            Sauce.updateOne({_id: req.params.id}, {likes:sauce.likes, usersLiked: sauce.usersLiked})
              .then( res.status(200).json({ message: 'the user is  unliked this sauce!'}))
              .catch(error => res.status(400).json({ error }));
          }else if(sauce.usersDisliked.includes(req.body.userId)) {
            let indexUsersDisliked = sauce.usersDisliked.indexOf(req.body.userId);
            sauce.dislikes--;
            sauce.usersDisliked.splice(indexUsersDisliked,1);
            Sauce.updateOne({_id: req.params.id}, {Dislikes:sauce.Dislikes, usersDisliked: sauce.usersDisliked})
              .then( res.status(200).json({ message: 'the user is  undisliked this sauce!'}))
              .catch(error => res.status(400).json({ error }));
              console.log(req.body.like);
          }
          break;
        case -1:
          if(!sauce.usersDisliked.includes(req.body.userId)){
            sauce.dislikes++;
            sauce.usersDisliked.push(req.body.userId);
            Sauce.updateOne({_id: req.params.id}, {dislikes:sauce.dislikes, usersDisliked: sauce.usersDisliked})
            .then( res.status(200).json({ message: 'user disliked this sauce!'}))
            .catch(error => res.status(400).json({ error }));
            console.log(req.body.like);
          }
      }
    })
    .catch(error => res.status(400).json({error}));
};