const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  // supprime le champ de la requete envoyée par le client - remplacé par le token d'authentification
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
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //vérifie que c'est le même utilisateur qui a crée la sauce
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: 'Not authorized' });
      }
      else { next }
    });
  //Mise à jour ou non de l'image et du texte
      const sauceModified = req.file ?
        {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
     Sauce.updateOne({ _id: req.params.id }, { ...sauceModified, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !' }))
      .catch(error => res.status(400).json({ error }));
  };


exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //vérifie que c'est le même utilisateur qui a crée la sauce
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: 'Not authorized' });
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
    .then(
      (sauce) => {
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


/* let likes = 1, aime la sauce
 like = 0 user annule son like
like = -1 n'aime pas la sauce, 
(js) includes(), $inc - $push et $pull (mongoDb) */

exports.likeSauce = function (request, response, next) {
  Sauce.findOne({ _id: request.params.id })
    .then(function (sauce) {
      switch (request.body.like) {
        // Like = 1 => L'utilisateur aime la sauce (like = +1)
        case 1:
          if (!sauce.usersLiked.includes(request.body.userId) && request.body.like === 1) {
            Sauce.updateOne({ _id: request.params.id },
              {
                $inc: { likes: 1 },
                $push: { usersLiked: request.body.userId }
              })
              .then(function () {
                response.status(201).json({ message: "Toi aussi tu aimes cette sauce!" });
              })
              .catch(function (error) {
                response.status(400).json({ error: error });
              });
          }
          break;
        //L'utilisateur n'aime pas la sauce 
        case -1:
          if (!sauce.usersDisliked.includes(request.body.userId) && request.body.like === -1) {
            Sauce.updateOne({ _id: request.params.id },
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: request.body.userId },
              }
            )
              .then(function () {
                response.status(201).json({ message: "Tu n'aimes pas cette sauce?!" });
              })
              .catch(function (error) {
                response.status(400).json({ error: error });
              });
          }
          break;
        //Annulation du like par l'utilisateur
        case 0:
          if (sauce.usersLiked.includes(request.body.userId)) {
            Sauce.updateOne({ _id: request.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: request.body.userId },
              }
            )
              .then(function () {
                response.status(201).json({ message: "Tu n'aimes plus cette sauce!" });
              })
              .catch(function (error) {
                response.status(400).json({ error: error });
              });
          }
          //Annulation du dislike par l'utilisateur
          if (sauce.usersDisliked.includes(request.body.userId)) {
            Sauce.updateOne(
              { _id: request.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: request.body.userId },
              }
            )
              .then(function () {
                response.status(201).json({ message: "ah finalement tu aimes cette sauce?!" });
              })
              .catch(function (error) {
                response.status(400).json({ error: error });
              });
          }
          break;
      }
    })
    .catch(function (error) {
      response.status(404).json({ error: error });
    });
};




