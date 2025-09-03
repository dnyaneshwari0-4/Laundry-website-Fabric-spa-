const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root@123",
  database: "laundry",
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/signupForm", (req, res) => {
  const { username, password } = req.body;

  const query = "INSERT INTO users (uname, upassword) VALUES (?, ?)";
  db.query(query, [username, password], (err, results) => {
      if (err) {
          console.error("Error inserting data:", err);
          res.status(500).send("Error inserting data into the database");
      } else {
          console.log("User data inserted successfully");
          res.redirect("/login");
      }
  });
});

app.post("/loginForm", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE uname = ? AND upassword = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      res.status(500).send("Error fetching data from the database");
    } else {
      if (results.length > 0) {
        res.redirect("/index");
      } else {
        res.status(401).send("Invalid login credentials");
      }
    }
  });
});

app.post("/contactForm", (req, res) => {
  const { uname, uemail, subjects, message } = req.body;

  const query = "INSERT INTO contact (uname, uemail, subjects, message) VALUES (?, ?, ?, ?)";
  db.query(query, [ uname, uemail, subjects, message], (err, results) => {
      if (err) {
          console.error("Error inserting data:", err);
          res.status(500).send({ success: false, message: "Error inserting data into the database" });
      } else {
          console.log("User data inserted successfully");
          res.status(400).send("Thank you!");
      }
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
