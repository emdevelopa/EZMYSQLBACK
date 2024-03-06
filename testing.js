const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");

const MemoryStore = require("memorystore")(session); // Use MemoryStore for session data

const app = express();

app.use(bodyParser.json());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new MemoryStore(), // Use MemoryStore for session data
  })
);

app.use(
  cors({
    origin: ["http://127.0.0.1:5501", "http://127.0.0.1:5500"],
    credentials: true, // Allow credentials (cookies, in this case)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  })
);

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "demo" && password === "12") {
    req.session.user = username;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.redirect("http://localhost:2000/dashboard.html");
  } else {
    res.redirect("/");
  }
});

app.get("/checkAuth", (req, res) => {
  console.log(req.session); // Log session information
  const authenticated = req.session.user !== undefined;
  const username = authenticated ? req.session.user : null;

  res.json({ authenticated, username });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.json({ success: true });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
