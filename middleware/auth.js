const dotenv = require("dotenv");
dotenv.config();
const jwt = require('jsonwebtoken');
const rateConnexion = require("express-rate-limit");
const user = require("../models/user");

module.exports = (req, res, next) => {
    try {

        const token = req.headers.authorization.split(' ')[1];
        console.log(token)
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET, "CLE SECRET");
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId,
        };
        //Vérifie que le token de l'userId correspond à l'Id de la requête
        if (req.body.userId && req.body.userId !== userId)
            throw 'Utilisateur Id invalid!'
        next();
    }
    catch (error) {
        res.status(401).json({ error: new Error('invalid request!') });
    }
};
const maxConnexion = rateConnexion({
    windowMs: 15 * 60 * 1000, //15 minutes de tentatives de connexion (ms)
    max: 10, // limité à 10 tentatives par adresse IP
    message: "Votre compte a été bloqué suite aux 3 tentatives de connexion échouées!",

});
module.exports = maxConnexion;