const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;


const OAuthPassport = (app) => {
  app.use(
    session({
      secret: "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",
      resave: true,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "948178692986-7msnq94ieb7arselb1foqi8cro911ed4.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://127.0.0.1:3000/auth/google/callback",
        scope: ["profile", "email", "phone"],
      },
      (accessToken, refreshToken, profile, done) => {
        // Check if user already exists in your database or create a new user
        // For demonstration purposes, let's assume a simple in-memory database

        // Check if user already exists
        const existingUser = users.find((user) => user.id === profile.id);
        console.log(profile);

        if (existingUser) {
          // User already exists, log them in
          console.log(existingUser);
          return done(null, existingUser);
        }

        // User doesn't exist, create a new user
        const newUser = {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
        };

        // Store the new user in your database or in-memory storage
        users.push(newUser);

        // Log the user in
        return done(null, newUser);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const user = users.find((user) => user.id === id);
    done(null, user);
  });

  // Sample in-memory storage for demonstration purposes
  const users = [];
};

module.exports = OAuthPassport;
