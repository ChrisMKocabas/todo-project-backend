require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const auth_port = process.env.AUTH_PORT || 8000;
const db = require("./auth-utils/db-controller"); //connect to database
const debug = require("debug")("app:server"); // Choose a custom namespace (app:server)

app.use(express.json());

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));
// Logging middleware
app.use((req, res, next) => {
  debug(`Received ${req.method} request at ${req.url}`);
  next();
});
// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/users", require("./routes/api/users"));
app.use("/todos", require("./routes/api/todos"));

app.all("*", (req, res) => {
  console.log(req.method, req.body, req.url);
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});
app.use((err, req, res, next) => {
  debug(`Error occurred: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});
app.use(errorHandler);

//Connect to DB and Start Server
async function startServer() {
  try {
    await db.initialize(db.database);
    if (mongoose.connection.readyState == 1) {
      app.listen(auth_port);
      console.log("Server listening on port : " + auth_port);
    }
  } catch (err) {
    console.log(err);
  }
}

startServer();
