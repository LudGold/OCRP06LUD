const dotenv = require("dotenv");
dotenv.config();
const path = require('path');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');

var helmet = require('helmet');
const app = express();


mongoose.connect(`mongodb+srv://${process.env.MONGODB_ID}:${process.env.MDP}@cluster0.xqjst5h.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//Permet de sécuriser les en-têtes HTPP
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
//CORS sert à alléger la sécurité en autorisant les requêtes vers d’autres domaines.
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;


