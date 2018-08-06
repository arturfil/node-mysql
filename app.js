const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');

const app = express();

app.use(morgan('combined'));

require('dotenv').config();

const port = 5000 || process.env.PORT;

app.get('/', (req, res, next) => {
  res.send('hello');
});

app.get('/user/:id', (req, res, next) => {
  console.log('route was being called to user with id: ' + req.params.id);

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.PASSWORD,
    database: 'mysql_tutorial_db',
  });

  const userId = req.params.id;
  const queryString = 'SELECT * FROM users WHERE id = ?';
  connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log('Failed to query for users: ' + err);
      res.sendStatus(500);
      return;
    }

    const users = rows.map(row => {
      return { firstName: row.first_name, lastName: row.last_name };
    });

    res.json(users);
  });
});

app.get('/users', (req, res, next) => {
  const user1 = { firstName: 'Stephen', lastName: 'Curry' };
  const user2 = { firstName: 'LeBron', lastName: 'James' };

  res.json([user1, user2]);
});

app.listen(port, () => {
  console.log('server started');
});
