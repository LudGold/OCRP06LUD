// base de données
const mongoose = require('mongoose');
// plugin de validation de contraintes uniques pour le shéma ci dessous
const uniqueValidator = require('mongoose-unique-validator');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0, required: true },
    dislikes: { type: Number, default: 0, required: true },
    usersLiked: { type: Array, default: [], required: true },
    usersDisliked: { type: Array, default: [], required: true }, 
});
sauceSchema.plugin(uniqueValidator);

//model permet de transformer le modèle afin qu'il soit utilisable
module.exports = mongoose.model('Sauce', sauceSchema);