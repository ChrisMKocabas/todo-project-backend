require("dotenv").config();

const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  {
    fullname: "muhammed",
    title: "Post 1",
  },
  {
    fullname: "Seyma",
    title: "Post 2",
  },
  {
    fullname: "Yekta",
    title: "Post 2",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.fullname == req.user.fullname));
});

//middleware for authenticating Token
function authenticateToken(req, res, next) {
  //get authorization header from request
  const authHeader = req.headers["authorization"];
  //if authHeader exits, split token from bearer and assign to token
  const token = authHeader && authHeader.split(" ")[1];
  //if token token is null send proper response
  if (token == null) return res.status(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); //if token expired
    //if token is valid
    req.user = {
      user_id: user.user_id,
      email: user.email,
      fullname: user.fullname,
    };
    next();
  });
}

app.listen(3000);
