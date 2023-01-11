const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require('../controllers/register');
const signin = require('../controllers/signin');
const profile = require('../controllers/profile');
const image = require('../controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: '',
    password: '',
    database: 'smart-brain',
  },
});

const app = express();

const whitelist = ['https://smartbrain-ten.vercel.app/'];
const corsOptions = {
  origin: function (origin, callback) {
    console.log('origin', origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Origin, X-Requested-With, Accept, Authorization'
  );
  res.header('Access-Control-Expose-Headers', '*');
  next();
});

app.use(express.json()); // latest version of exressJS now comes with Body-Parser!

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
