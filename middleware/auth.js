const dotenv = require("dotenv");
dotenv.config();
const jwt = require('jsonwebtoken');
/* const rateConnexion = require("express-rate-limit"); */


module.exports = (req, res, next) => {
    try {
        //Retourne un tableau, vérifie le TOKEN, récupère l'userID
        const token = req.headers.authorization.split(' ')[1];
        console.log(token)
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

        const userId = decodedToken.userId;
        req.auth = {
            userId: userId,
        };
        //Vérifie que le token de l'userId correspond à l'auteur de la requête
        if (req.body.userId && req.body.userId !== userId)
            throw 'Requête non autorisée'
        next();
    }
    catch (error) {
        res.status(401).json({ error: new Error('invalid request!') });
    }
};
/* à remettre quand plus de tests!
 const maxConnexion = rateConnexion({
    windowMs: 15 * 60 * 1000, //15 minutes de tentatives de connexion (ms)
    max: 10, // limité à 10 tentatives par adresse IP
    message: "Votre compte a été bloqué suite aux 10 tentatives de connexion échouées!",

});
module.exports = maxConnexion;  */