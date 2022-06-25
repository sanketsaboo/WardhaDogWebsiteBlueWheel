const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  console.log(req.cookies);
  const token = req.cookies.token;
  console.log(process.env.jwtSecret);
  if (!token) {
    next();
  }

  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    console.log("this is decoded msg-----------");
    console.log(decoded);
    req.user = decoded.user;
    console.log("this is req.user =========");
    console.log(req.user);
    if (!req.user.admin) {
      next();
    } else {
      return res.redirect("/admin/alldogs");
    }
  } catch {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
