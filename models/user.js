const mongoose = require('mongoose');
//sécurité supplémentaire pour ne pas avoir 2 utilisateurs avec le même e-mail
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);