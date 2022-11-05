const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
var cors = require('cors')
const mongoose = require('mongoose');
const app = express();


app.use(cors())

mongoose.connect(`mongodb+srv://${process.env.MONGODB_ID}:${process.env.MDP}@cluster0.xqjst5h.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());
  
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
 app.use('/api/auth/login', (req, res, next) => {
  const login = [
    {
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true }
    },];

  res.status(200).json(login);
}); 
app.use(cors());
 const userRoutes = require('./routes/user');
/* const saucesRoutes = require('./routes/sauces'); */
 app.use('/api/auth', userRoutes); 
 /* app.use('/api/sauces', saucesRoutes); */
 /* app.use('/images', express.static(path.join(_dirname, 'images')));  */

module.exports = app;










/* FICHIER DU 4 NOVEMBRE !! BON MAIS SERVER3000 NE MARCHE PAS
require('dotenv').config();
const express = require('express');
var helmet = require('helmet');


const mongoose = require('mongoose');
const sauceRoute = require('./routes/sauces')
const userRoute = require('./routes/user')
const path = require('path');

app.use(helmet());
mongoose.connect(`mongodb+srv://${process.env.MONGODB_ID}:${process.env.MDP}@cluster0.xqjst5h.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// permet d'analyser le corps de la requete Post
app.use(express.json());

// lors de requête GET, evite les erreurs CORS, cf sécurité
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/auth', userRoute);
app.use('/api/sauces', sauceRoute);
app.use('/images', express.static(path.join(_dirname, 'images')));
module.exports = app;

 */