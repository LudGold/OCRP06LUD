const passwordValidator = require("password-validator");

const passwordShema = new passwordValidator();
//shéma à respecter du mdp
passwordShema
    .is().min(5)                                    // Minimum length 5
    .is().max(50)                                  // Maximum length 50
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); //blacklist this value


//vérification strong password
module.exports = (req, res, next) => {
    if (passwordShema.validate(req.body.password)) {
        next();
    }
    else {
        return res.status(400).json({ error: `le mot de passe n'est pas assez fort ${passwordShema.validate(req.body.password, { list: true })}` })
    }
}


