require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require('../controllers/register');
const signin = require('../controllers/signin');
const profile = require('../controllers/profile');
const image = require('../controllers/image');

const PORT = process.env.PORT || 3000;

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

const app = express();

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});
app.post('/api/signin', signin.handleSignin(db, bcrypt));
app.post('/api/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get('/api/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.put('/api/image', (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/api/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
