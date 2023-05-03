process.on("uncaughtException", (err) => {
  console.log(`There was an uncaught error ${err}`);
  process.exit(1);
});

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
//connecting to mongo db
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
connectDB();

const PORT = process.env.PORT || 5000;

// custom middleware logger
app.use(logger);

//Handles options credentials check ---before CORS!
//and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
//these are the domain from which u want ur backend to be accessed

app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, "/public")));

//root routes
app.use("/", require("./routes/root"));

//register route
app.use("/register", require("./routes/register"));

//login route
app.use("/auth", require("./routes/auth"));

//refresh route  (This must always come b4 the verify jwt below)
app.use("/refresh", require("./routes/refresh"));

app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);

//employees route
app.use("/employees", require("./routes/api/employees"));

//Handles all types of request from the frontend
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

//Custom error handler that displays error in the browser
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
