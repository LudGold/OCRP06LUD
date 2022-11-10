const express = require('express');
const router = express.Router();
//import sauces controllers
const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

//routes disponibles dans notre application
// Route pour l'affichage de toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces);
//Route pour la création d'une sauce
router.post('/', auth, multer, sauceCtrl.createSauce);
// Route pour l'affichage d'une seule sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
// Route pour la modification d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// Route pour la suppression d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
//Route pour le like de la sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce); 


// export sauces routes
module.exports = router;