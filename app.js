const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const bcrypt = require('bcrypt')
const { hashPassword } = require('./hash');

const app = express();
const cors = require('cors'); // Import cors


const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})

// Route to register a new user
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const date = new Date();
    const hashedPassword = await hashPassword(password);
    await db.none('INSERT INTO users (username, email, created_at, password_hash) VALUES ($1, $2, $3, $4)', [username, email, date, hashedPassword]);
    res.send('User registered successfully!');
  } catch (error) {
    res.status(500).send('Error registering user');
    console.error(error);
  }
});

// Route to handle user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
    let result = false
    const date = new Date();
    if (user && await bcrypt.compare(password, user.password_hash)) {
      result = true
      await db.none('INSERT INTO logins (username, success, login_timestamp) VALUES ($1, $2, $3)', [username, result, date]);
      res.status(200).send('Login successful!');
    } else {
      await db.none('INSERT INTO logins (username, success, login_timestamp) VALUES ($1, $2, $3)', [username, result, date]);
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    res.status(500).send('An error occurred while processing your request');
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
