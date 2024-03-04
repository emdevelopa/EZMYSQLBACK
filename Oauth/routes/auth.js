const express = require("express");
const passport = require("passport");

const authGoogle = express.Router();

authGoogle.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email", "phone"] })
);

authGoogle.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/fail" }),
  (req, res) => {
    // console.log("from", req);

    // OAuth callback logic
    if (req.user.id === "113567378071433430420") {
      res.redirect("/dashboard");
    } else {
      res.redirect("/dashboard");
    }
  }
);

const already = (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1>User already exists</h1>`);
    console.log(req.user);
  } else {
    res.redirect("/");
  }
};

const dashboard = (req, res) => {
  console.log(`Phone Number: ${req.user.phone}`);
  if (req.isAuthenticated()) {
    console.log(`Phone Number: ${req.user.phone}`);
    res.send(
      `<h1>Welcome, ${req.user.displayName}!</h1><p>Email: ${req.user.email}</p>`
    );
  } else {
    res.redirect("/");
  }
};

// Export the authGoogle
module.exports = { authGoogle, already, dashboard };
