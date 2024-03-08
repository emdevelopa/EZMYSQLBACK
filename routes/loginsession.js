const loginSession = (req, res) => {
  if (req.session.user) {
    const user = req.session.user;
    const loggedIn = req.session.loggedIn;
    res.send({
      loggedIn,
      user,
    });
  } else
    res.send({
      loggedIn: false,
    });
};

module.exports = loginSession;
