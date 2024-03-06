const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to parse cookies
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

// Route to set a cookie
app.post("/set-cookie", (req, res) => {
  // Set a cookie with name 'exampleCookie' and value 'Hello, Cookie!'
  console.log(req.body);
  res.cookie("example", "Hello, Cookie!");

  // Send a response
  res.send("Cookie has been set!");
});

// Route to get the cookie
app.get("/get-cookie", (req, res) => {
  // Retrieve the value of the 'exampleCookie' cookie
  const cookieValue = req.cookies.example;

  // Check if the cookie exists
  if (cookieValue) {
    res.send(`Cookie value: ${cookieValue}`);
  } else {
    res.send("Cookie not found");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
