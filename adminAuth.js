const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  console.log(req.cookies);
  const token = req.cookies.token;
  console.log(process.env.jwtSecret);
  if (!token) {
    return res.redirect("/adminLogin");
  }

  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    console.log("this is decoded msg-----------");
    console.log(decoded);
    req.user = decoded.user;
    console.log("this is req.user =========");
    console.log(req.user);
    next();
  } catch {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
