const mongoose = require('mongoose');
//sécurité supplémentaire pour ne pas avoir 2 adresses e-mails identiques
const uniqueValidator = require('mongoose-unique-validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const userSchema = new mongoose.Schema({

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);