const User = require('../models/user');
//import de bcrypt pour chiffrer le mot de passe
const bcrypt = require("bcrypt");
//import de crypto pour chiffrer le mail
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();


exports.signup = (req, res, next) => {

    const emailCrypto = CryptoJS.HmacSHA256(req.body.email, process.env.EMAILCRYPTO).toString();

    //10 tours pour creer un mdp securisé, methode asynchrone
    bcrypt.hash(req.body.password, 10)

        .then(hash => {
            console.log('emailCrypto', emailCrypto, 'hash', hash)
            const user = new User({

                email: emailCrypto,
                password: hash,
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    const emailCrypto = CryptoJS.HmacSHA256(req.body.email, process.env.EMAILCRYPTO).toString();
    User.findOne({ email: emailCrypto })
        .then(findUser => {
            if (!findUser) {
                res.status(401).json({ message: 'identifiant non reconnu' });
            }
            else {
                bcrypt.compare(req.body.password, findUser.password)

                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({
                                message: 'mot de passe incorrect'
                            })
                        } else {
                            res.status(200).json({
                                userId: findUser._id,
                                token: jwt.sign(
                                    { userId: findUser._id },
                                    process.env.TOKEN_SECRET,
                                    { expiresIn: '24h' }
                                )
                            });
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ error });
                    })
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        })
};

