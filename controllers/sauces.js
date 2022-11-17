const Sauce = require('../models/sauce');
const fs = require('fs');
  

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._userId;
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => {
      res.status(201).json({ message: 'Nouvelle sauce enregistrée!' });
    })
    .catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

exports.modifySauce = (req, res, next) => {
  //on verifie si l'image a été modifiée
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  /* delete imageUrl._userId;* faire en sorte que l'image d'avant soit retirée && fs.unlink(`images/${filename}`) */
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {

        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      }
      else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }) })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

 /* let likes = 1,
  like = 0 user annule son like
like = -1 n'aime pas la sauce,
   js includes(), $inc - $push et $pull (mongoDb)
 if () {
 
} 

 exports.likeSauce = function (req, res, next) {
 if (req.body.like === 1) */
   //Sauce.findOne({ _id: req.params.id })

    /* .then( Sauce => {
     switch (req.body.like === 1) {
      Like = 1 => L'utilisateur aime la sauce (like = +1)
        case 1: 
    if (Sauce.usersLiked.indexOf(req.body.userId) && req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id },
          {
            $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }
          })
          .then(function () {
            response.status(201).json({ message: "La sauce a été likée !" });
          })
          .catch(function (error) {
            response.status(400).json({ error: error });
          });
      }
     break;
    }

    )
};
 if (!Sauce.usersLiked.indexOf(req.body.userId) && req.body.like === 0) {
  Sauce.updateOne({ _id: req.params.id },
    {
      $inc: { likes: -1 }, $push: { usersLiked: req.body.userId }
    })
    .then(function () {
      response.status(201).json({ message: "La sauce a été likée !" });
    })
    .catch((error) =>
      response.status(400).json({ error: error }))

};  */
 
exports.likeSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
          // Si l'utilisateur n'a pas encore aimé ou non une sauce
          if(sauce.usersDisliked.includes(req.body.userId) == -1 && sauce.usersLiked.includes(req.body.userId) == -1) {
              if(req.body.like == 1) { // L'utilisateur aime la sauce
                  sauce.usersLiked.push(req.body.userId);
                  sauce.likes += req.body.like;
              } else if(req.body.like == -1) { // L'utilisateur n'aime pas la sauce
                  sauce.usersDisliked.push(req.body.userId);
                  sauce.dislikes -= req.body.like;
              };
          };
          // Si l'utilisateur veut annuler son "like"
          if(sauce.usersLiked.includes(req.body.userId) != -1 && req.body.like == 0) {
              const likesUserI = sauce.usersLiked.findI(user => user === req.body.userId);
              sauce.usersLiked.splice(likesUserI, 1);
              sauce.likes -= 1;
          };
          // Si l'utilisateur veut annuler son "dislike"
          if(sauce.usersDisliked.includes(req.body.userId) != -1 && req.body.like == 0) {
              const likesUserI = sauce.usersDisliked.findI(user => user === req.body.userId);
              sauce.usersDisliked.splice(likesUserI, 1);
              sauce.dislikes -= 1;
          }
          sauce.save();
          res.status(201).json({ message: 'Like / Dislike mis à jour' });
      })
      .catch(error => res.status(500).json({ error }));
};
