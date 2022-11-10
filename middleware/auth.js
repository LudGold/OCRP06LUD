const dotenv = require("dotenv");
dotenv.config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        
        const token = req.headers.authorization.split(' ')[1];
       console.log(token)
         const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); 
        
         console.log( 'aie', decodedToken)
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    }
    catch (error) {
        res.status(401).json({ error: new Error('invalid request!') });
    }
};